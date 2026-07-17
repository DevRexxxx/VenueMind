import os
import json
import time
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from .state import AgentState
from .tools import (
    get_sector_status, check_active_incidents, get_available_staff,
    get_microclimate_data, trigger_heat_protocol, check_accessible_routes,
    get_sensory_zone_capacity, scan_ticket_anomalies, predict_concession_stockouts,
    calculate_evacuation_time
)

api_key = os.environ.get("GROQ_API_KEY", "dummy_key")
llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.2, api_key=api_key)

tools = [
    get_sector_status, check_active_incidents, get_available_staff,
    get_microclimate_data, trigger_heat_protocol, check_accessible_routes,
    get_sensory_zone_capacity, scan_ticket_anomalies, predict_concession_stockouts,
    calculate_evacuation_time
]
llm_with_tools = llm.bind_tools(tools)

def orchestrator_node(state: AgentState):
    messages = state["messages"]
    system_prompt = SystemMessage(content="""You are the VenueMind AI Orchestrator. 
Your job is to route stadium queries to the correct specialized agent.
Available agents: Security, Medical, Crowd, Weather, Accessibility, Fraud, Evacuation, Vendor.
If the user is asking about a specific incident, route to the appropriate agent by responding with exactly the agent name: 'ROUTE: <AgentName>'.
If the query is general or if specialized agents have already gathered data, synthesize the final response.
Always maintain a calm, professional, command-center tone.""")
    
    response = llm.invoke([system_prompt] + list(messages))
    
    routing_map = {
        "ROUTE: Security": "security",
        "ROUTE: Medical": "medical",
        "ROUTE: Crowd": "crowd",
        "ROUTE: Weather": "weather",
        "ROUTE: Accessibility": "accessibility",
        "ROUTE: Fraud": "fraud",
        "ROUTE: Evacuation": "evacuation",
        "ROUTE: Vendor": "vendor",
    }
    
    for key, val in routing_map.items():
        if key in response.content:
            return {"current_agent": val}
            
    xai_trace = {
        "agent": "Orchestrator",
        "action": "Synthesized final response",
        "confidence": 0.99,
        "data_sources": ["Agent Reports", "Context"],
        "rules_applied": ["Final synthesis after agent execution"],
        "timestamp": int(time.time() * 1000)
    }
            
    return {
        "messages": [response], 
        "current_agent": "orchestrator", 
        "is_resolved": True,
        "reasoning_traces": [xai_trace]
    }

def _invoke_agent(state: AgentState, name: str, prompt: str):
    from api.models import AgentConfig
    import os
    
    # Defaults
    model_name = "llama-3.1-8b-instant"
    temperature = 0.2
    autonomy_level = "advisory"
    confidence_threshold = 92
    
    try:
        config = AgentConfig.objects.get(agent_id__iexact=name)
        model_name = config.model_engine
        temperature = config.temperature
        autonomy_level = config.autonomy_level
        confidence_threshold = config.confidence_threshold
    except AgentConfig.DoesNotExist:
        pass
        
    api_key = os.environ.get("GROQ_API_KEY", "dummy_key")
    dynamic_llm = ChatGroq(model=model_name, temperature=temperature, api_key=api_key)
    dynamic_llm_with_tools = dynamic_llm.bind_tools(tools)

    messages = state["messages"]
    
    autonomy_instruction = "\nIMPORTANT: You are in ADVISORY mode. You may suggest actions but DO NOT execute any tools that modify state without explicit human approval."
    if autonomy_level == "autonomous":
        autonomy_instruction = "\nIMPORTANT: You are in AUTONOMOUS mode. You are authorized to execute tools and workflows directly without waiting for human approval."
        
    sys_prompt = SystemMessage(content=prompt + autonomy_instruction + f"\nProvide a reasoning trace for your decisions to support Explainable AI (XAI). Your required confidence threshold is {confidence_threshold}%.")
    
    response = dynamic_llm_with_tools.invoke([sys_prompt] + list(messages))
    
    xai_trace = {
        "agent": name,
        "action": f"Analyzed context using {model_name} (Temp: {temperature}) in {autonomy_level} mode.",
        "confidence": 0.95,
        "data_sources": ["System Context", "User Input"],
        "rules_applied": [f"{name} Protocol v2.1", f"Threshold: {confidence_threshold}%"],
        "timestamp": int(time.time() * 1000)
    }
    
    return {
        "messages": [response], 
        "current_agent": "orchestrator",
        "reasoning_traces": [xai_trace],
        "confidence_score": 0.95
    }

def security_agent_node(state: AgentState):
    return _invoke_agent(state, "Security", "You are the VenueMind Security Agent. Use your tools to check sectors, gates, and staff to resolve security queries.")

def medical_agent_node(state: AgentState):
    return _invoke_agent(state, "Medical", "You are the VenueMind Medical Agent. Use your tools to dispatch medics and check health incidents.")

def crowd_agent_node(state: AgentState):
    return _invoke_agent(state, "Crowd", "You are the VenueMind Crowd Agent. Monitor densities and gate flow.")

def weather_agent_node(state: AgentState):
    return _invoke_agent(state, "Weather", "You are the VenueMind Weather/Climate Resilience Agent. Monitor conditions and trigger heat protocols or halts for lightning.")

def accessibility_agent_node(state: AgentState):
    return _invoke_agent(state, "Accessibility", "You are the VenueMind Accessibility Agent. Track wheelchair routes and sensory zones.")

def fraud_agent_node(state: AgentState):
    return _invoke_agent(state, "Fraud", "You are the VenueMind Fraud/Ticketing Agent. Detect duplicate scans and counterfeit patterns.")

def evacuation_agent_node(state: AgentState):
    return _invoke_agent(state, "Evacuation", "You are the VenueMind Evacuation Agent. Run live 'what-if' simulations.")

def vendor_agent_node(state: AgentState):
    return _invoke_agent(state, "Vendor", "You are the VenueMind Vendor Demand-Forecasting Agent. Predict concession stockouts.")

