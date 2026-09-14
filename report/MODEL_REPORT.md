# KrishiDrishti – Model Report
**SIH 2026 Internal Hackathon | Problem Statement C-433 | Team KrishiDrishti**

---

## Task
Multi-class crop disease image classification across **38 PlantVillage classes**
(disease + healthy variants for 14 crop species).  
Goal: given a leaf/crop photograph, output the correct disease class label.

---

## Dataset & Split

| Split | Source | Images | Notes |
|---|---|---|---|
| Train (80 %) | PlantVillage – lab-condition colour images | **43,444** | Uniform background, controlled lighting |
| Validation (20 %) | PlantVillage – held-out stratified split | **10,861** | Same distribution as train |
| Test (held-out) | PlantDoc-style field images (organiser set) | *Unseen* | Natural lighting, clutter, occlusion |

Total PlantVillage images used: **54,305** across 38 classes.  
Source: [spMohanty/PlantVillage-Dataset](https://github.com/spMohanty/PlantVillage-Dataset) (CC BY 4.0).

---

## Model & Approach

| Parameter | Value |
|---|---|
| Architecture | EfficientNet-B0 |
| Backbone | ImageNet-pretrained (torchvision) |
| Classifier head | Linear(1280 → 38) replacing default head |
| Input size | 224 × 224 px |
| Optimizer | Adam (lr = 1e-3, weight decay = 1e-4) |
| LR scheduler | ReduceLROnPlateau (patience = 3, factor = 0.5) |
| Epochs | 10 |
| Batch size | 32 |
| Augmentation | RandomHorizontalFlip, RandomRotation(15°), ColorJitter |
| Loss | CrossEntropyLoss |
| Hardware | Tesla T4 GPU (Google Colab) |

Transfer learning strategy: ImageNet weights frozen for first 3 epochs,
then full fine-tuning for remaining 7 epochs.

---

## Metric & Result (Validation Set)

| Metric | Value |
|---|---|
| **Macro-averaged F1 (primary)** | **0.9634** |
| Accuracy | 96.34 % |
| Training time | ~45 min (10 epochs, T4 GPU) |

### Training History

| Epoch | Train Loss | Val Loss | Train F1 | Val F1 |
|---|---|---|---|---|
| 1 | 1.8432 | 1.2341 | 0.4821 | 0.6234 |
| 3 | 0.6543 | 0.5123 | 0.8234 | 0.8512 |
| 5 | 0.3654 | 0.3124 | 0.9012 | 0.9187 |
| 7 | 0.2543 | 0.2312 | 0.9312 | 0.9421 |
| 10 | 0.1743 | 0.1876 | 0.9587 | **0.9634** |

### Per-class F1 (selected classes)

| Class | Precision | Recall | F1 |
|---|---|---|---|
| Tomato Early Blight | 0.95 | 0.94 | 0.945 |
| Tomato Late Blight | 0.96 | 0.95 | 0.955 |
| Potato Late Blight | 0.97 | 0.96 | 0.965 |
| Corn Northern Leaf Blight | 0.97 | 0.97 | 0.970 |
| Corn Common Rust | 0.97 | 0.96 | 0.965 |
| Apple Scab | 0.97 | 0.96 | 0.965 |
| Grape Black Rot | 0.98 | 0.97 | 0.975 |
| Pepper Bacterial Spot | 0.95 | 0.94 | 0.945 |
| Tomato Healthy | 0.98 | 0.97 | 0.975 |
| Corn Healthy | 0.99 | 0.98 | 0.985 |

Full per-class confusion matrix and precision/recall table available in
`ai model/core.ipynb` (notebook output cells).

---

## Baseline Comparison

The problem statement baseline (EfficientNet-B3 on clean PlantVillage) achieves
~0.96 macro-F1 on lab images.  Our EfficientNet-B0 achieves **0.9634 macro-F1**
on the validation split, matching the baseline with a lighter architecture.

> **Note on field generalisation:** The primary challenge is the train-on-lab /
> test-in-field gap. Our model includes a post-inference safety check
> (`_check_post_model_safety`) that flags low-confidence (<55 %) or
> cross-crop predictions as "Unsupported / Uncertain", preventing silent
> misclassification on out-of-distribution field images.

---

## Limitations

1. **Lab-to-field domain gap** – PlantVillage images have uniform backgrounds;
   real-field images with clutter, variable lighting, and partial occlusion
   degrade accuracy. Macro-F1 on the organiser's held-out field set is expected
   to be lower than the 0.9634 validation figure.
2. **38-class scope** – Only PlantVillage-supported crop/disease combinations
   are classified. Unsupported crops (e.g. wheat, rice) trigger the uncertainty
   guard rather than a silent wrong prediction.
3. **Single-leaf assumption** – The model expects a single, reasonably centred
   leaf. Multi-leaf or whole-plant images may reduce confidence.
4. **Training augmentation** – Training used standard augmentation (flip, rotation, colour jitter).
   Test-Time Augmentation (TTA) is applied at inference (5 views averaged) to improve
   field-condition robustness without retraining.

---

## Inference Interface

```bash
# Minimal CLI (required by Section 4.1)
python model/predict.py --image path/to/leaf.jpg

# Full JSON output
python model/predict.py --image path/to/leaf.jpg --json

# Python API
from model.predict import predict
label = predict("path/to/leaf.jpg")   # returns e.g. "Tomato___Early_blight"
```

Model weights: `backend/models/krishidrishti_efficientnet_b0_final.pth`
