from fastapi import FastAPI
from api import root, poem_v1, poem_v2, poem_v3, poem_v4

app = FastAPI()
app.include_router(root.router)
app.include_router(poem_v1.router)
app.include_router(poem_v2.router)
app.include_router(poem_v3.router)
app.include_router(poem_v4.router)
