FROM python:3.13 AS builder

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

COPY pyproject.toml uv.lock README.md ./
RUN uv sync --no-dev --compile-bytecode --frozen

FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libjpeg62-turbo \
    && rm -rf /var/lib/apt/lists/*

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1-aarch64 /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=builder /app/.venv /app/.venv
COPY . .

ENV PATH="/app/.venv/bin:$PATH"
ENV HOME="/tmp"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]