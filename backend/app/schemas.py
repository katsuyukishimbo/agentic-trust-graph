from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel


class AgentRequest(BaseModel):
    user_input: str


class AgentRunResponse(BaseModel):
    status: Literal["pending"]
    session_id: str
    output: str
    classification: Optional[str]
    prompt_hash: Optional[str]


class PendingItem(BaseModel):
    session_id: str
    output: str
    classification: Optional[str]
    prompt_hash: Optional[str]


class ApproveResponse(BaseModel):
    status: Literal["approved"]
    result: dict[str, Any]
