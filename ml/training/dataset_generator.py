import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

CLASSES = [
    "Healthy",
    "Early Blight",
    "Late Blight",
    "Leaf Mold",
    "Septoria Leaf Spot"
]

def generate_leaf_base(size=(224, 224), green_shade=(40, 140, 40)):
    """Generate a realistic leaf shape with given base color."""
    img = Image.new("RGB", size, (240, 235, 225)) # Background neutral canvas
    draw = ImageDraw.Draw(img)
    
    # Draw leaf shape (ellipse / polygon mix)
    leaf_bbox = [30, 20, 194, 204]
    draw.ellipse(leaf_bbox, fill=green_shade, outline=(25, 90, 25))
    
    # Draw leaf veins
    draw.line([112, 30, 112, 194], fill=(60, 180, 60), width=3)
    for y in range(50, 180, 20):
        draw.line([112, y, 60, y - 15], fill=(50, 160, 50), width=2)
        draw.line([112, y, 164, y - 15], fill=(50, 160, 50), width=2)
        
    return img

def add_early_blight_spots(img):
    """Early Blight: Dark brown circular spots with concentric target rings."""
    draw = ImageDraw.Draw(img)
    np.random.seed(42)
    spots = [(70, 70), (130, 110), (90, 150), (140, 60)]
    for x, y in spots:
        r = np.random.randint(12, 22)
        # Concentric rings
        draw.ellipse([x - r - 4, y - r - 4, x + r + 4, y + r + 4], fill=(210, 190, 60)) # Yellow halo
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(80, 45, 20)) # Dark brown outer
        draw.ellipse([x - r + 4, y - r + 4, x + r - 4, y + r - 4], fill=(120, 70, 30)) # Inner ring
        draw.ellipse([x - 3, y - 3, x + 3, y + 3], fill=(50, 25, 10)) # Center spot
    return img

def add_late_blight_lesions(img):
    """Late Blight: Large irregular water-soaked dark patches."""
    draw = ImageDraw.Draw(img)
    np.random.seed(43)
    # Large dark water-soaked patches
    draw.polygon([(40, 50), (90, 40), (110, 90), (60, 110)], fill=(45, 40, 30))
    draw.polygon([(110, 120), (160, 100), (170, 160), (120, 170)], fill=(35, 30, 20))
    # Pale mold rim
    draw.line([(40, 50), (90, 40), (110, 90)], fill=(200, 200, 190), width=3)
    return img

def add_leaf_mold_patches(img):
    """Leaf Mold: Yellowish spots on top, velvety brown patches."""
    draw = ImageDraw.Draw(img)
    np.random.seed(44)
    # Pale yellow upper spots
    for _ in range(8):
        x, y = np.random.randint(50, 170), np.random.randint(50, 170)
        r = np.random.randint(8, 16)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(180, 190, 50))
        draw.ellipse([x - r//2, y - r//2, x + r//2, y + r//2], fill=(100, 80, 30))
    return img

def add_septoria_spots(img):
    """Septoria Leaf Spot: Numerous small circular spots with grey centers."""
    draw = ImageDraw.Draw(img)
    np.random.seed(45)
    for _ in range(25):
        x = np.random.randint(55, 165)
        y = np.random.randint(45, 175)
        r = np.random.randint(3, 6)
        draw.ellipse([x - r - 1, y - r - 1, x + r + 1, y + r + 1], fill=(50, 30, 15)) # Dark border
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(160, 160, 155)) # Grey center
        draw.point((x, y), fill=(20, 20, 20)) # Micro pycnidia dot
    return img

def generate_dataset(output_dir="ml/dataset", samples_per_class=40):
    """Generate synthetic representative images for training and validation."""
    print(f"Generating dataset with {samples_per_class} images per class...")
    os.makedirs(output_dir, exist_ok=True)
    
    for cls_name in CLASSES:
        cls_dir = os.path.join(output_dir, cls_name.lower().replace(" ", "_"))
        os.makedirs(cls_dir, exist_ok=True)
        
        for i in range(samples_per_class):
            # Introduce subtle random variations
            g_val = np.random.randint(120, 160)
            base_img = generate_leaf_base(green_shade=(30, g_val, 30))
            
            if cls_name == "Healthy":
                img = base_img
            elif cls_name == "Early Blight":
                img = add_early_blight_spots(base_img)
            elif cls_name == "Late Blight":
                img = add_late_blight_lesions(base_img)
            elif cls_name == "Leaf Mold":
                img = add_leaf_mold_patches(base_img)
            elif cls_name == "Septoria Leaf Spot":
                img = add_septoria_spots(base_img)
            
            # Save image
            img_path = os.path.join(cls_dir, f"{cls_name.lower().replace(' ', '_')}_{i+1:03d}.jpg")
            img.save(img_path, quality=95)
            
    print("Dataset generation complete!")

if __name__ == "__main__":
    import sys
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../dataset"))
    generate_dataset(output_dir=dataset_dir, samples_per_class=40)
