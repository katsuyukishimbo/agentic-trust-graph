from __future__ import annotations

import hashlib
from typing import Callable

from langchain_core.runnables import Runnable

from .state import AgentState


def classify_and_structure(state: AgentState) -> AgentState:
    """Naively classify the input text and produce a requirements-style summary."""

    input_text = state["user_input"].strip()
    if any(k in input_text for k in ["壊れ", "エラー", "バグ", "落ちる"]):
        classification = "バグ報告"
    elif any(k in input_text for k in ["改善", "わかりづら", "UX", "UI", "遅い", "速く"]):
        classification = "改善要望"
    else:
        classification = "機能要望"

    structured_output = (
        f"- 種別: {classification}\n"
        f"- 事象/要望: {input_text}\n"
        "- 受け入れ条件(例):\n"
        "  - 再現手順が記述されている\n"
        "  - 期待動作と現状の差分が明記されている\n"
        "  - 必要ならスクリーンショット/端末情報を添付\n"
    )
    prompt_hash = hashlib.sha256(input_text.encode()).hexdigest()[:10]
    return {
        **state,
        "classification": classification,
        "structured_output": structured_output,
        "prompt_hash": prompt_hash,
    }


def hitl_gate(state: AgentState) -> AgentState:
    """Hold the workflow until an explicit approval call is made via the API."""

    return state


def save_to_notion(state: AgentState) -> AgentState:
    """Persist the approved item.

    For this reference implementation we only print a stub log. Replace with the
    actual Notion API integration when credentials are provided.
    """

    print(f"[NotionStub] Saving issue with hash {state['prompt_hash']}")
    return state


def log_output(state: AgentState) -> AgentState:
    """Emit a structured log for observability."""

    log_data = {
        "event": "Complete",
        "prompt_hash": state.get("prompt_hash"),
        "session_id": state.get("session_id"),
        "approved": state.get("approved"),
        "output": state.get("structured_output"),
    }
    print(f"[LOG] {log_data}")
    return state


def as_runnable(node_fn: Callable[[AgentState], AgentState]) -> Runnable:
    """Wrap a node function as a LangChain runnable."""

    return Runnable(node_fn)
