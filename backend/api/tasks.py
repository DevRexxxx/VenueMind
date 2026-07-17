from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

@shared_task
def broadcast_incident_alert(incident_id, message, severity):
    """
    Background task to broadcast a new incident alert to all connected 
    clients on the dashboard via WebSockets.
    """
    channel_layer = get_channel_layer()
    
    # In a real scenario, we might fetch the Incident from DB using incident_id
    # incident = Incident.objects.get(id=incident_id)
    
    event_data = {
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
