"""
KrishiDrishti – Crop Disease Detection : Inference Script
==========================================================
Usage (CLI – required by Section 4.1 of the problem statement):

    python predict.py --image path/to/leaf.jpg

Output (stdout):
    <class_label>

Full structured output (JSON) is also printed when --json flag is used:
    python predict.py --image path/to/leaf.jpg --json

The script loads the trained EfficientNet-B0 weights from:
    ../backend/models/krishidrishti_efficientnet_b0_final.pth

Python API (importable):
    from predict import predict
    label = predict("path/to/leaf.jpg")   # returns class label string
"""

import argparse
import io
import json
import sys
from pathlib import Path

# ── Dependency check ──────────────────────────────────────────────────────────
try:
    import torch
    import torch.nn as nn
    from torchvision import transforms
    from torchvision.models import efficientnet_b0
    from PIL import Image
except ImportError as e:
    sys.exit(
        f"[ERROR] Missing dependency: {e}\n"
        "Run:  pip install torch torchvision Pillow\n"
        "  or:  pip install -r ../backend/requirements.txt"
    )

# ── Model path (relative to this file) ───────────────────────────────────────
_MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "backend" / "models" / "krishidrishti_efficientnet_b0_final.pth"
)

# ── Module-level cache so repeated calls don't reload weights ─────────────────
_bundle = None
_transform = None


def _load_model():
    """Load EfficientNet-B0 checkpoint (lazy, cached)."""
    global _bundle, _transform
    if _bundle is not None:
        return _bundle, _transform

    if not _MODEL_PATH.exists():
        sys.exit(
            f"[ERROR] Model weights not found at:\n  {_MODEL_PATH}\n"
            "Please ensure the .pth file is present in backend/models/."
        )

    checkpoint = torch.load(
        str(_MODEL_PATH),
        map_location=torch.device("cpu"),
        weights_only=False,
    )

    class_names = checkpoint["class_names"]
    num_classes = checkpoint.get("num_classes", len(class_names))
    image_size  = checkpoint.get("image_size", 224)

    model = efficientnet_b0(weights=None)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()

    _transform = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225]),
    ])

    _bundle = {
        "model":       model,
        "class_names": class_names,
        "idx_to_class": checkpoint.get(
            "idx_to_class",
            {str(i): c for i, c in enumerate(class_names)}
        ),
    }
    return _bundle, _transform


def predict(image_path: str) -> str:
    """
    Public API – required by Section 4.1 of the problem statement.

    Parameters
    ----------
    image_path : str
        Absolute or relative path to a leaf/crop image (JPG, PNG, WEBP …).

    Returns
    -------
    str
        Predicted class label in PlantVillage format, e.g.
        "Tomato___Early_blight" or "Corn_(maize)___healthy".
    """
    bundle, tfm = _load_model()

    img = Image.open(image_path).convert("RGB")
    tensor = tfm(img).unsqueeze(0)          # shape: [1, 3, H, W]

    with torch.no_grad():
        logits = bundle["model"](tensor)
        probs  = torch.softmax(logits, dim=1)[0]

    top_idx   = int(probs.argmax())
    top_label = bundle["class_names"][top_idx]
    return top_label


def predict_detailed(image_path: str) -> dict:
    """
    Extended inference – returns top-5 probabilities plus parsed crop/condition.

    Returns
    -------
    dict with keys:
        class_label  – raw PlantVillage class string
        crop         – human-readable crop name
        condition    – human-readable disease / condition
        healthy      – bool
        confidence   – float (0-1)
        top5         – list of {class_label, probability}
    """
    bundle, tfm = _load_model()

    img    = Image.open(image_path).convert("RGB")
    tensor = tfm(img).unsqueeze(0)

    with torch.no_grad():
        logits = bundle["model"](tensor)
        probs  = torch.softmax(logits, dim=1)[0]

    top5_vals, top5_idx = torch.topk(probs, min(5, len(probs)))
    class_names = bundle["class_names"]

    top5 = [
        {"class_label": class_names[i.item()], "probability": round(v.item(), 4)}
        for v, i in zip(top5_vals, top5_idx)
    ]

    best_label = top5[0]["class_label"]
    confidence = top5[0]["probability"]

    # Parse "Crop___Condition" format
    parts     = best_label.split("___", 1)
    crop      = parts[0].replace("_", " ").replace("(", "").replace(")", "").strip()
    condition = parts[1].replace("_", " ").strip() if len(parts) > 1 else "Unknown"
    healthy   = "healthy" in condition.lower()

    return {
        "class_label": best_label,
        "crop":        crop,
        "condition":   condition,
        "healthy":     healthy,
        "confidence":  confidence,
        "top5":        top5,
    }


# ── CLI entry-point ───────────────────────────────────────────────────────────
def _cli():
    parser = argparse.ArgumentParser(
        description="KrishiDrishti – Crop Disease Prediction CLI"
    )
    parser.add_argument(
        "--image", required=True,
        help="Path to the leaf/crop image file."
    )
    parser.add_argument(
        "--json", action="store_true",
        help="Print full JSON output instead of just the class label."
    )
    args = parser.parse_args()

    if not Path(args.image).exists():
        sys.exit(f"[ERROR] Image not found: {args.image}")

    if args.json:
        result = predict_detailed(args.image)
        print(json.dumps(result, indent=2))
    else:
        # Minimal output required by Section 4.1
        label = predict(args.image)
        print(label)


if __name__ == "__main__":
    _cli()
