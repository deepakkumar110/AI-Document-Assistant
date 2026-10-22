import os
import time
import logging

from dotenv import load_dotenv
from google import genai
from google.genai import errors


load_dotenv()

logger = logging.getLogger(__name__)

API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    raise ValueError(
        "GOOGLE_API_KEY missing. Check your backend/.env file."
    )

client = genai.Client(api_key=API_KEY)

# Primary Gemini model

MODEL_NAME = "gemini-3.6-flash"
# Retry configuration
MAX_RETRIES = 3
INITIAL_RETRY_DELAY = 2


def generate_answer(prompt: str) -> str:
    """
    Generate an answer using Gemini with retry handling
    for temporary server errors and rate limits.
    """

    if not prompt or not prompt.strip():
        raise ValueError("Prompt cannot be empty.")

    for attempt in range(MAX_RETRIES):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
            )

            answer = response.text

            if not answer or not answer.strip():
                raise ValueError(
                    "Gemini returned an empty response."
                )

            return answer.strip()

        except errors.APIError as error:
            status_code = getattr(error, "code", None)

            # Retry temporary server errors and rate limits.
            if status_code not in (429, 500, 502, 503, 504):
                logger.exception(
                    "Gemini API request failed."
                )
                raise

            if attempt == MAX_RETRIES - 1:
                logger.exception(
                    "Gemini API failed after all retry attempts."
                )
                raise

            delay = INITIAL_RETRY_DELAY * (2 ** attempt)

            logger.warning(
                "Gemini returned HTTP %s. "
                "Retrying in %s seconds (attempt %s/%s).",
                status_code,
                delay,
                attempt + 1,
                MAX_RETRIES,
            )

            time.sleep(delay)

    raise RuntimeError("Gemini could not generate an answer.")