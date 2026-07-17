import operator
from typing import TypedDict, Annotated, Sequence, List, Dict, Any
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    incident_id: int
    current_agent: str
    recommended_actions: List[str]
    is_resolved: bool
    # Explainable AI (XAI) tracking
    reasoning_traces: Annotated[List[Dict[str, Any]], operator.add]
    data_sources_used: Annotated[List[str], operator.add]
    confidence_score: float

