def create_chunks(
    text: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
):
    if not text or not text.strip():
        return []

    if chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be smaller than chunk_size")

    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = min(start + chunk_size, text_length)

        # Word ko beech mein todne se bachne ki koshish
        if end < text_length:
            split_at = text.rfind(" ", start, end)

            if split_at > start:
                end = split_at

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end >= text_length:
            break

        next_start = end - chunk_overlap

        # Infinite loop se bachav
        start = max(next_start, start + 1)

    return chunks