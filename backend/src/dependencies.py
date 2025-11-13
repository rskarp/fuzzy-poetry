from src.services.poem_v4_service import PoemV4Service
from functools import lru_cache


def get_lancedb_client():
    # db = get_db()
    # try:
    #     yield db
    # finally:
    #     db.close()
    pass


@lru_cache()
def get_poem_v4_service():
    return PoemV4Service()
