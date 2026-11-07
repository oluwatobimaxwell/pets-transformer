# syntax=docker/dockerfile:1
# The engine, its command line and the web API in one image.
# The challenge toolkit arrives as the "toolkit" build context (see compose.yaml), so it never has to be copied into this repository.
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PETS_ROOT=/data/challenge

RUN useradd --create-home --uid 1000 app
WORKDIR /app

COPY --from=toolkit . /opt/toolkit
COPY engine engine
COPY web/backend/requirements.txt web/backend/requirements.txt
RUN --mount=type=cache,target=/root/.cache/pip \
    cd web/backend && pip install /opt/toolkit -r requirements.txt

COPY web/backend web/backend
# Uploaded data, keys and row maps live here, on a volume that only the API sees.
RUN mkdir workspace && chown app:app workspace

USER app
WORKDIR /app/web/backend
EXPOSE 8000
# Listing the samples also proves the challenge package is mounted.
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=3 \
    CMD ["python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/samples/')"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
