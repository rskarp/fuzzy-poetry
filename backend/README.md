Install dependencies
```
# Create virtual environment
uv venv .venv

# Install dependencies
uv pip install -e .

# Add a new dependency
uv add package-name

# Add a dev dependency
uv add --dev package-name

# Update dependencies
uv lock --upgrade

# Sync your environment with uv.lock
uv sync
```
Run the app
```
uv run uvicorn src.main:app --reload --env-file .env
```