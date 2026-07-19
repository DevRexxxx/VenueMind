import logging

from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

logger = logging.getLogger(__name__)


@shared_task
def broadcast_incident_alert(incident_id, message, severity):
    """
    Background task to broadcast a new incident alert to all connected
    clients on the dashboard via WebSockets.
    """
    channel_layer = get_channel_layer()

    event_data = {
        'type': 'dashboard_update',
        'update_type': 'incident_alert',
        'message': {
            'incident_id': incident_id,
            'alert_message': message,
            'severity': severity
        }
    }

    async_to_sync(channel_layer.group_send)(
        "dashboard_updates",
        event_data
    )
    return f"Broadcasted alert for incident {incident_id}"


@shared_task
def process_llm_query_task(query):
    """
    Background Celery task to invoke the LangGraph AI Orchestrator network
    and broadcast the response to connected WebSocket clients.

    This replaces the previous raw threading approach, which risked
    silently dropped tasks and memory leaks under production load.
    """
    try:
        from .agents.graph import invoke_agent_network
        response_text = invoke_agent_network(query)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "dashboard_updates",
            {
                "type": "dashboard_update",
                "update_type": "ai_response",
                "message": response_text
            }
        )
    except Exception:
        logger.exception("Agent query failed for input length=%d", len(query))
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "dashboard_updates",
            {
                "type": "dashboard_update",
                "update_type": "ai_error",
                "message": "An internal error occurred while processing your query."
            }
        )
