from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, HTTPException
from langchain_core.runnables import Runnable

from app.schemas import (
    AgentRequest,
    AgentRunResponse,
    ApproveResponse,
    PendingItem,
)
from services.hitl_store import HITLStore
from workflow.state import AgentState


def create_router(graph: Runnable, store: HITLStore) -> APIRouter:
    router = APIRouter()

    @router.post("/run-agent", response_model=AgentRunResponse)
    async def run_agent(req: AgentRequest) -> AgentRunResponse:
        session_id = str(uuid4())
        state: AgentState = {
            "user_input": req.user_input,
            "session_id": session_id,
            "approved": None,
        }
        result = graph.invoke(state)

        store.add(session_id, result)
        return AgentRunResponse(
            status="pending",
            session_id=session_id,
            output=result["structured_output"],
            classification=result.get("classification"),
            prompt_hash=result.get("prompt_hash"),
        )

    @router.get("/pending", response_model=list[PendingItem])
    async def list_pending() -> list[PendingItem]:
        return [
            PendingItem(
                session_id=sid,
                output=data["structured_output"],
                classification=data.get("classification"),
                prompt_hash=data.get("prompt_hash"),
            )
            for sid, data in store.items()
        ]

    @router.post("/approve/{session_id}", response_model=ApproveResponse)
    async def approve(session_id: str) -> ApproveResponse:
        state = store.pop(session_id)
        if state is None:
            raise HTTPException(status_code=404, detail="session_id not found")

        state["approved"] = True
        final_result = graph.invoke(state)
        return ApproveResponse(status="approved", result=dict(final_result))

    return router
