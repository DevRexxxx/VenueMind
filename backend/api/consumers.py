import json
import asyncio
import aiohttp
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings as django_settings
from django.core.cache import cache
from api.models import Incident, Alert, AgentConfig
import logging

logger = logging.getLogger(__name__)

def get_wmo_weather_condition(code):
    """Map a WMO weather interpretation code to a human-readable condition string."""
    if code == 0:
        return "Clear Sky"
    elif code in [1, 2, 3]:
        return "Partly Cloudy" if code < 3 else "Overcast"
    elif code in [45, 48]:
        return "Fog"
    elif code in [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]:
        return "Light Rain" if code in [51, 53, 61, 80] else "Heavy Rain"
    elif code in [71, 73, 75, 77, 85, 86]:
        return "Snow"
    elif code in [95, 96, 99]:
        return "Thunderstorm"
    return "Clear Sky"


class DashboardConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time dashboard updates.

    Manages a single shared group (``dashboard_updates``) and spawns
    a per-connection asyncio task that delivers live weather, system
    status, and agent network data every 5 seconds.
    """
    async def connect(self):
        # We join a global group for dashboard updates
        self.group_name = "dashboard_updates"
        
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

        # Start a background task for this connection to send simulated live data
        self.sim_task = asyncio.create_task(self.simulate_live_data())

    async def disconnect(self, close_code):
        if hasattr(self, 'sim_task'):
            self.sim_task.cancel()
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Receive message from room group
    async def dashboard_update(self, event):
        message = event['message']
        type = event.get('update_type', 'general')

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': type,
            'message': message
        }))

    @database_sync_to_async
    def get_system_status(self):
        # Query for critical unresolved incidents
        critical_incidents = Incident.objects.filter(severity='high', status__in=['reported', 'investigating']).count()
        if critical_incidents > 0:
            return {"text": f"Critical Incidents: {critical_incidents}", "color": "#f59e0b"} # Orange/Yellow
        
        active_alerts = Alert.objects.filter(is_active=True, severity__in=['high', 'critical']).count()
        if active_alerts > 0:
            return {"text": "Alerts Active", "color": "#ef4444"} # Red
            
        return {"text": "All Systems Operational", "color": "#10b981"}

    @database_sync_to_async
    def get_agent_network_status(self):
        # Fetch active agents dynamically
        agent_configs = AgentConfig.objects.all()
        agents = []
        for config in agent_configs:
            agents.append({
                "id": config.agent_id.lower(),
                "label": f"{config.agent_id} Agent",
                "type": config.agent_id
            })

        if not agents:
            agents = list(django_settings.DEFAULT_AGENT_STATUSES)
            
        active_incidents = Incident.objects.exclude(status='resolved')
        
        results = []
        for agent in agents:
            agent_incidents = active_incidents.filter(type=agent["type"])
            if not agent_incidents.exists():
                status_label = "Standby" if agent["id"] == "emergency" else "Healthy"
                color = "gray" if agent["id"] == "emergency" else "green"
            else:
                severities = [inc.severity for inc in agent_incidents]
                if 'critical' in severities:
                    status_label, color = "Critical", "red"
                elif 'high' in severities:
                    status_label, color = "Active", "blue"
                else:
                    status_label, color = "Warning", "orange"
                    
            results.append({
                "id": agent["id"],
                "label": agent["label"],
                "status": status_label,
                "color": color
            })
        return results

    async def simulate_live_data(self):
        try:
            while True:
                weather_temp = "26°C"
                weather_condition = "Clear Sky"
                # Check cache first for weather
                weather_data = cache.get("live_weather_data")
                
                if weather_data:
                    weather_temp = weather_data.get("temp", weather_temp)
                    weather_condition = weather_data.get("condition", weather_condition)
                else:
                    # Fetch real weather for New York / New Jersey (MetLife Stadium)
                    try:
                        async with aiohttp.ClientSession() as session:
                            url = "https://api.open-meteo.com/v1/forecast?latitude=40.81&longitude=-74.07&current_weather=true"
                            async with session.get(url, timeout=5) as resp:
                                if resp.status == 200:
                                    data = await resp.json()
                                    current = data.get('current_weather', {})
                                    weather_temp = f"{round(current.get('temperature', 26))}°C"
                                    weather_condition = get_wmo_weather_condition(current.get('weathercode', 0))
                                    # Cache for 5 minutes (300 seconds)
                                    cache.set("live_weather_data", {"temp": weather_temp, "condition": weather_condition}, 300)
                    except Exception as e:
                        logger.warning("Error fetching live weather: %s", e)

                # Query database for real system status
                system_status = await self.get_system_status()
                agent_network = await self.get_agent_network_status()

                # Build payload
                payload = {
                    'type': 'live_header',
                    'data': {
                        'weather': {
                            'temp': weather_temp,
                            'condition': weather_condition
                        },
                        'system_status': system_status,
                        'agent_network': agent_network,
                        'match': {
                            'home': 'ARG',
                            'away': 'FRA',
                            'stage': 'Group Stage',
                            'status': 'Live'
                        }
                    }
                }
                await self.send(text_data=json.dumps(payload))
                await asyncio.sleep(5) # send every 5 seconds
        except asyncio.CancelledError:
            pass
