from langchain_core.runnables import Runnable
from langgraph.graph import END, StateGraph

from .nodes import (
    as_runnable,
    classify_and_structure,
    hitl_gate,
    log_output,
    save_to_notion,
)
from .state import AgentState


def build_graph() -> Runnable:
    """Configure and compile the LangGraph workflow."""

    builder = StateGraph(AgentState)
    builder.add_node("Classify", as_runnable(classify_and_structure))
    builder.add_node("HITL", as_runnable(hitl_gate))
    builder.add_node("Save", as_runnable(save_to_notion))
    builder.add_node("Log", as_runnable(log_output))

    builder.set_entry_point("Classify")
    builder.add_edge("Classify", "HITL")
    builder.add_edge("HITL", "Save")
    builder.add_edge("Save", "Log")
    builder.add_edge("Log", END)

    return builder.compile()
