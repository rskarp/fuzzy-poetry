Install dependencies
```
uv venv .venv
uv pip install -r poetry.lock
```
Run the app
```
source .venv/bin/activate
uvicorn main:app --reload
```
or 
```
uv run uvicorn main:app --reload
```