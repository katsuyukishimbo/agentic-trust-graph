from __future__ import annotations

from typing import Dict, Iterable, Tuple

from workflow.state import AgentState


class HITLStore:
    """In-memory storage for pending HITL approvals."""

    def __init__(self) -> None:
        self._store: Dict[str, AgentState] = {}

    def add(self, session_id: str, state: AgentState) -> None:
        self._store[session_id] = state

    def pop(self, session_id: str) -> AgentState | None:
        return self._store.pop(session_id, None)

    def get(self, session_id: str) -> AgentState | None:
        return self._store.get(session_id)

    def items(self) -> Iterable[Tuple[str, AgentState]]:
        return self._store.items()
