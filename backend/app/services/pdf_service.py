import fitz
import easyocr
from pdf2image import convert_from_path
import tempfile
import os

# OCR Reader
reader = easyocr.Reader(["en"], gpu=False)

# OCR Cache Folder
CACHE_DIR = "app/ocr_cache"
os.makedirs(CACHE_DIR, exist_ok=True)


def extract_text_from_pdf(pdf_path: str):

    # Cache file
    pdf_name = os.path.splitext(os.path.basename(pdf_path))[0]
    cache_file = os.path.join(CACHE_DIR, f"{pdf_name}.txt")

    # ===============================
    # OCR Cache
    # ===============================
    if os.path.exists(cache_file):
        print("✅ OCR Cache Found")

        with open(cache_file, "r", encoding="utf-8") as f:
            return f.read()

    # ===============================
    # Normal PDF Text Extraction
    # ===============================
    doc = fitz.open(pdf_path)

    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()

    # Text PDF
    if text.strip():

        print("✅ Text PDF Detected")

        with open(cache_file, "w", encoding="utf-8") as f:
            f.write(text)

        return text

    # ===============================
    # OCR
    # ===============================
    print("⚠️ Scanned PDF Detected. Starting OCR...")

    images = convert_from_path(pdf_path)

    ocr_text = ""

    for image in images:

        with tempfile.NamedTemporaryFile(
            suffix=".png",
            delete=False
        ) as temp:

            image.save(temp.name)

            result = reader.readtext(
                temp.name,
                detail=0,
                paragraph=True
            )

            ocr_text += "\n".join(result) + "\n"

        os.remove(temp.name)

    # Save OCR Cache
    with open(cache_file, "w", encoding="utf-8") as f:
        f.write(ocr_text)

    print("✅ OCR Completed & Cached")

    return ocr_text