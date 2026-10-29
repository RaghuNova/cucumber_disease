"""
Classifier module using Hugging Face ConvNeXt model via timm:
Model: ixrbhii/cucumber-disease-convnext
8 supported classes:
1. Angular Leaf Spot
2. Anthracnose
3. Bacterial Wilt
4. Downy Mildew
5. Gummy Stem Blight
6. Healthy Leaves
7. Nutrient Deficiency
8. Powdery Mildew
"""

import io
import logging
from typing import Dict, List, Tuple
from PIL import Image
import torch
from torchvision import transforms
import timm

logger = logging.getLogger("classifier")

MODEL_HUB_ID = "hf-hub:ixrbhii/cucumber-disease-convnext"

# Canonical labels mapping (Hugging Face model uses "Healthy", we present "Healthy Leaves")
DISPLAY_LABELS = {
    "Angular Leaf Spot": "Angular Leaf Spot",
    "Anthracnose": "Anthracnose",
    "Bacterial Wilt": "Bacterial Wilt",
    "Downy Mildew": "Downy Mildew",
    "Gummy Stem Blight": "Gummy Stem Blight",
    "Healthy": "Healthy Leaves",
    "Healthy Leaves": "Healthy Leaves",
    "Nutrient Deficiency": "Nutrient Deficiency",
    "Powdery Mildew": "Powdery Mildew"
}

PRIMARY_CLASSES = {"Downy Mildew", "Powdery Mildew", "Healthy Leaves"}

class LeafClassifier:
    def __init__(self, model_id: str = MODEL_HUB_ID):
        self.model_id = model_id
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.transform = None
        self.labels: List[str] = []
        self._load_model()

    def _load_model(self):
        logger.info(f"Loading timm model: {self.model_id} onto {self.device}")
        try:
            self.model = timm.create_model(self.model_id, pretrained=True)
            self.model.to(self.device)
            self.model.eval()

            cfg = getattr(self.model, "default_cfg", {})
            input_size = cfg.get("input_size", [3, 224, 224])
            h, w = input_size[1], input_size[2]
            mean = cfg.get("mean", [0.485, 0.456, 0.406])
            std = cfg.get("std", [0.229, 0.224, 0.225])

            raw_labels = cfg.get("label_names", [
                "Angular Leaf Spot", "Anthracnose", "Bacterial Wilt", "Downy Mildew",
                "Gummy Stem Blight", "Healthy", "Nutrient Deficiency", "Powdery Mildew"
            ])
            self.labels = [DISPLAY_LABELS.get(lbl, lbl) for lbl in raw_labels]

            self.transform = transforms.Compose([
                transforms.Resize((h, w)),
                transforms.ToTensor(),
                transforms.Normalize(mean=mean, std=std)
            ])
            logger.info(f"Model loaded successfully with {len(self.labels)} classes.")
        except Exception as e:
            logger.error(f"Failed to load timm model: {e}")
            raise e

    def is_plausible_leaf(self, image: Image.Image) -> Tuple[bool, str]:
        """
        Heuristic out-of-distribution check to detect completely blank, non-leaf,
        or extreme low-contrast images.
        """
        try:
            rgb_img = image.convert("RGB")
            # Downsample for quick statistical analysis
            thumb = rgb_img.resize((64, 64))
            pixels = list(thumb.getdata())
            
            # Check standard deviation to avoid solid black/white images
            r_vals = [p[0] for p in pixels]
            g_vals = [p[1] for p in pixels]
            b_vals = [p[2] for p in pixels]
            
            avg_g = sum(g_vals) / len(g_vals)
            avg_r = sum(r_vals) / len(r_vals)
            avg_b = sum(b_vals) / len(b_vals)
            
            # Check standard deviation of lightness
            lightness = [(r + g + b) / 3.0 for r, g, b in pixels]
            mean_light = sum(lightness) / len(lightness)
            var_light = sum((l - mean_light) ** 2 for l in lightness) / len(lightness)
            std_light = var_light ** 0.5

            if std_light < 8.0:
                return False, "Image appears completely uniform or blank. Please upload a clear photo of a cucumber leaf."

            # Most plant leaves have noticeable green/yellow/brown tones
            # where green or red is higher than deep blue
            if avg_b > avg_g + 45 and avg_b > avg_r + 45:
                return False, "The image appears predominantly blue or synthetic. Ensure the photo focuses on a plant leaf."

            return True, ""
        except Exception as e:
            logger.warning(f"Leaf validation error: {e}")
            return True, ""

    def predict(self, image_bytes: bytes) -> Dict:
        """
        Runs ConvNeXt inference on input image bytes and returns structured prediction.
        """
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as e:
            raise ValueError(f"Could not decode image: {e}")

        is_leaf, leaf_warning = self.is_plausible_leaf(image)

        tensor = self.transform(image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            logits = self.model(tensor)
            probs = torch.softmax(logits, dim=1)[0].cpu()

        prob_list = probs.tolist()
        class_probs = []
        for idx, p in enumerate(prob_list):
            label = self.labels[idx]
            class_probs.append({
                "class_name": label,
                "probability": float(p),
                "is_primary": label in PRIMARY_CLASSES
            })

        # Sort descending
        class_probs.sort(key=lambda x: x["probability"], reverse=True)

        top_pred = class_probs[0]
        top_confidence = top_pred["probability"]
        top_class = top_pred["class_name"]

        # Confidence interpretation
        if top_confidence >= 0.70:
            confidence_level = "High Confidence"
            confidence_note = "The model identified clear visual indicators matching this category."
        elif top_confidence >= 0.45:
            confidence_level = "Moderate Confidence"
            confidence_note = "Symptom patterns show resemblance, but secondary signs should also be inspected."
        else:
            confidence_level = "Low Confidence"
            confidence_note = "Visual patterns are ambiguous or multiple conditions may co-exist. Expert review is advised."

        # Top 3 predictions
        top_3 = class_probs[:3]

        return {
            "prediction": top_class,
            "confidence": float(top_confidence),
            "confidence_percentage": round(top_confidence * 100, 1),
            "confidence_level": confidence_level,
            "confidence_note": confidence_note,
            "is_primary": top_class in PRIMARY_CLASSES,
            "top_3": top_3,
            "all_probabilities": class_probs,
            "is_plausible_leaf": is_leaf,
            "warning": leaf_warning if not is_leaf else (
                "Low confidence result. We recommend capturing a closer photo in even lighting or consulting an agronomist."
                if top_confidence < 0.45 else None
            ),
            "image_dimensions": {
                "width": image.width,
                "height": image.height
            }
        }


# Global singleton instance
_classifier_instance = None

def get_classifier() -> LeafClassifier:
    global _classifier_instance
    if _classifier_instance is None:
        _classifier_instance = LeafClassifier()
    return _classifier_instance
