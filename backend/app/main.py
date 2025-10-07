from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import create_router
from services.hitl_store import HITLStore
from workflow.graph import build_graph


def create_app() -> FastAPI:
    graph = build_graph()
    store = HITLStore()

    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(create_router(graph, store))

    return app


app = create_app()
