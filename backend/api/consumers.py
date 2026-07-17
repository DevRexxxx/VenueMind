import json
import asyncio
import random
import aiohttp
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from datetime import datetime
from api.models import Incident, Alert

def get_wmo_weather_condition(code):
    # Map WMO weather codes to our conditions
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

    async def simulate_live_data(self):
        try:
            while True:
                weather_temp = "26°C"
                weather_condition = "Clear Sky"
                
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
                except Exception as e:
                    print("Error fetching weather:", e)
                    pass

                # Query database for real system status
                system_status = await self.get_system_status()

                # Build payload
                payload = {
                    'type': 'live_header',
                    'data': {
                        'weather': {
                            'temp': weather_temp,
                            'condition': weather_condition
                        },
                        'system_status': system_status,
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
