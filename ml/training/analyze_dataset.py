import os
from PIL import Image
from collections import Counter

TRAIN_DIR = "../dataset/train"
TEST_DIR = "../dataset/test"


def analyze_dataset(dataset_path, dataset_name):

    print("\n" + "=" * 60)
    print(f"{dataset_name} DATASET ANALYSIS")
    print("=" * 60)

    total_images = 0
    corrupted_images = 0

    class_counts = {}

    for class_name in sorted(os.listdir(dataset_path)):

        class_path = os.path.join(dataset_path, class_name)

        if not os.path.isdir(class_path):
            continue

        image_count = 0

        for file in os.listdir(class_path):

            file_path = os.path.join(class_path, file)

            try:
                with Image.open(file_path) as img:
                    img.verify()

                image_count += 1
                total_images += 1

            except Exception:
                corrupted_images += 1
                print(f"Corrupted image: {file_path}")

        class_counts[class_name] = image_count

    print("\nClasses Found:")

    for class_name, count in class_counts.items():
        print(f"{class_name}: {count}")

    print("\nTotal Classes:", len(class_counts))
    print("Total Images:", total_images)
    print("Corrupted Images:", corrupted_images)


if __name__ == "__main__":

    analyze_dataset(TRAIN_DIR, "TRAIN")
    analyze_dataset(TEST_DIR, "TEST")