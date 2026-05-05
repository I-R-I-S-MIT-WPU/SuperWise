"""ASGI entrypoint for running the backend with Uvicorn.

This module exists to support the common `uvicorn main:app --reload` command.
"""

from api import app

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
