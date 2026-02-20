import logging
import sys
from pathlib import Path
import os


def setup_logging():
    """Configure application logging"""

    is_lambda = "AWS_EXECUTION_ENV" in os.environ

    # Create formatter
    formatter = logging.Formatter(
        fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    console_handler.setLevel(logging.INFO)

    # Root logger configuration
    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.setLevel(logging.INFO if is_lambda else logging.DEBUG)
    root_logger.addHandler(console_handler)

    if not is_lambda:
        # Create logs directory if it doesn't exist
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)

        # File handler
        file_handler = logging.FileHandler(log_dir / "app.log")
        file_handler.setFormatter(formatter)
        file_handler.setLevel(logging.DEBUG)

        # Error file handler
        error_handler = logging.FileHandler(log_dir / "error.log")
        error_handler.setFormatter(formatter)
        error_handler.setLevel(logging.ERROR)

        root_logger.addHandler(file_handler)
        root_logger.addHandler(error_handler)
    else:
        root_logger.info(
            "Lambda environment detected. File logging disabled, streaming to CloudWatch."
        )

    # Suppress noisy loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("openai").setLevel(logging.WARNING)
