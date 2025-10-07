from typing import Optional, TypedDict


class AgentState(TypedDict):
    """State tracked throughout the LangGraph workflow."""

    user_input: str
    classification: Optional[str]
    structured_output: Optional[str]
    approved: Optional[bool]
    prompt_hash: Optional[str]
    session_id: Optional[str]
