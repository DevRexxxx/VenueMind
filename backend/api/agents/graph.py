from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from .state import AgentState
from .nodes import (
    orchestrator_node, 
    security_agent_node, 
    medical_agent_node, 
    crowd_agent_node,
    weather_agent_node,
    accessibility_agent_node,
    fraud_agent_node,
    evacuation_agent_node,
    vendor_agent_node,
    tools
)

def route_from_orchestrator(state: AgentState):
    if state.get("is_resolved"):
        return END
    
    agent = state.get("current_agent")
    agents = ["security", "medical", "crowd", "weather", "accessibility", "fraud", "evacuation", "vendor"]
    if agent in agents:
        return agent
    return END

def should_continue(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]
    if last_message.tool_calls:
        return "tools"
    return "orchestrator"

builder = StateGraph(AgentState)

builder.add_node("orchestrator", orchestrator_node)
builder.add_node("security", security_agent_node)
builder.add_node("medical", medical_agent_node)
builder.add_node("crowd", crowd_agent_node)
builder.add_node("weather", weather_agent_node)
builder.add_node("accessibility", accessibility_agent_node)
builder.add_node("fraud", fraud_agent_node)
builder.add_node("evacuation", evacuation_agent_node)
builder.add_node("vendor", vendor_agent_node)

tool_node = ToolNode(tools)
builder.add_node("tools", tool_node)

builder.set_entry_point("orchestrator")

builder.add_conditional_edges(
    "orchestrator",
    route_from_orchestrator,
    {
        "security": "security",
        "medical": "medical",
        "crowd": "crowd",
        "weather": "weather",
        "accessibility": "accessibility",
        "fraud": "fraud",
        "evacuation": "evacuation",
        "vendor": "vendor",
        END: END
    }
)

spoke_agents = ["security", "medical", "crowd", "weather", "accessibility", "fraud", "evacuation", "vendor"]
for node in spoke_agents:
    builder.add_conditional_edges(
        node,
        should_continue,
        {
            "tools": "tools",
            "orchestrator": "orchestrator"
        }
    )

builder.add_edge("tools", "orchestrator")

graph = builder.compile()

def invoke_agent_network(query: str):
    from langchain_core.messages import HumanMessage
    
    initial_state = {
        "messages": [HumanMessage(content=query)],
        "incident_id": 0,
        "current_agent": "orchestrator",
        "recommended_actions": [],
        "is_resolved": False,
        "reasoning_traces": [],
        "data_sources_used": [],
        "confidence_score": 0.0
    }
    
    result = graph.invoke(initial_state)
    return result["messages"][-1].content
