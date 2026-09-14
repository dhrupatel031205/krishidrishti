"""
Module A - Crop Recommendation : training script.

Usage:
    python train_crop.py --csv Crop_recommendation.csv

Trains a RandomForest classifier, reports accuracy + macro-F1 + confusion
matrix on a held-out test split, and saves the model to models/crop_model.pkl.

Dataset: Crop Recommendation Dataset (Atharva Ingle, Kaggle)
  Columns: N, P, K, temperature, humidity, ph, rainfall, label
"""
import argparse
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)
from sklearn.model_selection import train_test_split

FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
TARGET = "label"
MODEL_PATH = Path(__file__).resolve().parent / "models" / "crop_model.pkl"


def main(csv_path: str) -> None:
    df = pd.read_csv(csv_path)
    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)
    model.fit(X_train.values, y_train)

    y_pred = model.predict(X_test.values)
    acc = accuracy_score(y_test, y_pred)
    macro_f1 = f1_score(y_test, y_pred, average="macro")

    print("=" * 55)
    print("Module A - Crop Recommendation : results (held-out test)")
    print("=" * 55)
    print(f"Test samples : {len(y_test)}")
    print(f"Accuracy     : {acc:.4f}")
    print(f"Macro-F1     : {macro_f1:.4f}")
    print("-" * 55)
    print("Per-class precision / recall / f1:")
    print(classification_report(y_test, y_pred, zero_division=0))
    print("-" * 55)
    print("Confusion matrix shape:", confusion_matrix(y_test, y_pred).shape)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {"model": model, "features": FEATURES, "classes": sorted(y.unique())},
        MODEL_PATH,
    )
    print(f"\nSaved model -> {MODEL_PATH}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", default="Crop_recommendation.csv")
    args = parser.parse_args()
    main(args.csv)