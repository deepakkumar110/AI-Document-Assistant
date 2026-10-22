import os
import tempfile
from pathlib import Path

import easyocr
import fitz
from pdf2image import convert_from_path


# Store extracted text for reuse
APP_DIR = Path(__file__).resolve().parents[1]
CACHE_DIR = APP_DIR / "ocr_cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

# Initialize OCR reader
# First run may download the required OCR model.
reader = easyocr.Reader(["en"], gpu=False)


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from a PDF.
    If the PDF is scanned and contains no extractable text,
    use EasyOCR to recognize text from its pages.
    """

    pdf_file = Path(pdf_path)

    if not pdf_file.exists():
        raise FileNotFoundError(f"PDF file not found: {pdf_file}")

    if pdf_file.suffix.lower() != ".pdf":
        raise ValueError("Only PDF files are supported.")

    # Use the unique uploaded filename for caching
    cache_file = CACHE_DIR / f"{pdf_file.stem}.txt"

    if cache_file.exists():
        cached_text = cache_file.read_text(encoding="utf-8")
        if cached_text.strip():
            return cached_text

    # STEP 1: Extract embedded text using PyMuPDF
    extracted_text = []

    try:
        with fitz.open(str(pdf_file)) as document:
            for page in document:
                page_text = page.get_text("text")
                if page_text.strip():
                    extracted_text.append(page_text)

    except Exception as error:
        raise ValueError(
            "Could not read this PDF. The file may be corrupted or invalid."
        ) from error

    text = "\n\n".join(extracted_text).strip()

    # STEP 2: Return embedded text when available
    if text:
        cache_file.write_text(text, encoding="utf-8")
        return text

    # STEP 3: If scanned PDF, perform OCR
    print("No embedded text found. Starting OCR...")

    try:
        images = convert_from_path(str(pdf_file))
        ocr_pages = []

        for image in images:
            temp_path = None

            try:
                with tempfile.NamedTemporaryFile(
                    suffix=".png",
                    delete=False
                ) as temp_file:
                    temp_path = temp_file.name

                image.save(temp_path, format="PNG")

                results = reader.readtext(
                    temp_path,
                    detail=0,
                    paragraph=True
                )

                page_text = "\n".join(results).strip()
                ocr_pages.append(page_text)

            finally:
                if temp_path and os.path.exists(temp_path):
                    os.remove(temp_path)

        text = "\n\n".join(ocr_pages).strip()

    except Exception as error:
        raise RuntimeError(
            "PDF OCR failed. Check EasyOCR and Poppler installation."
        ) from error

    # STEP 4: Save extracted text in cache
    if text:
        cache_file.write_text(text, encoding="utf-8")

    return text