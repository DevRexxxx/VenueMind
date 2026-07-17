from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Stadium, Sector, Gate, Staff, Incident, Alert, Asset, CrowdMetricSnapshot
from .serializers import (StadiumSerializer, SectorSerializer, GateSerializer, StaffSerializer, 
                          IncidentSerializer, AlertSerializer, AssetSerializer, CrowdMetricSnapshotSerializer)
from .agents.graph import invoke_agent_network

class StadiumViewSet(viewsets.ModelViewSet):
    queryset = Stadium.objects.all()
    serializer_class = StadiumSerializer

class SectorViewSet(viewsets.ModelViewSet):
    queryset = Sector.objects.all()
    serializer_class = SectorSerializer

class GateViewSet(viewsets.ModelViewSet):
    queryset = Gate.objects.all()
    serializer_class = GateSerializer

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer

class CrowdMetricSnapshotViewSet(viewsets.ModelViewSet):
    queryset = CrowdMetricSnapshot.objects.all()
    serializer_class = CrowdMetricSnapshotSerializer

class AgentQueryView(APIView):
    """
    Endpoint to send a natural language query to the LangGraph AI Orchestrator.
    """
    def post(self, request):
        import os
        query = request.data.get('query')
        if not query:
            return Response({"error": "No query provided"}, status=status.HTTP_400_BAD_REQUEST)
            
        api_key = os.environ.get("GROQ_API_KEY", "dummy_key")
        if api_key == "dummy_key":
            return Response(
                {"error": "Groq API key is missing. Please add GROQ_API_KEY to your Render Environment Variables to use the AI features for free."}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            response_text = invoke_agent_network(query)
            return Response({"response": response_text}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SimulateView(APIView):
    """
    Endpoint for Digital Twin "What-If" Simulation Engine.
    Accepts scenarios like 'gate_closure' or 'surge' and returns updated sector densities.
    """
    def post(self, request):
        scenario = request.data.get('scenario')
        
        if not scenario:
            return Response({"error": "No scenario provided"}, status=status.HTTP_400_BAD_REQUEST)
            
        sectors = Sector.objects.all()
        sector_data = SectorSerializer(sectors, many=True).data
        
        # Simulate logic (mock algorithms)
        if scenario == 'gate_closure':
            gate_id = request.data.get('gate_id', 3)
            # Assume Gate 3 feeds Sector S1 and S2. If closed, S3 and S4 take the load.
            for s in sector_data:
                if s['name'] in ['S1', 'S2']:
                    s['current_occupancy'] = max(0, s['current_occupancy'] - 500)
                elif s['name'] in ['S3', 'S4']:
                    s['current_occupancy'] = min(s['capacity'], s['current_occupancy'] + 500)
                    
        elif scenario == 'surge':
            magnitude = request.data.get('magnitude', 1000)
            sector_name = request.data.get('sector_name', 'N1')
            for s in sector_data:
                if s['name'] == sector_name:
                    s['current_occupancy'] = min(s['capacity'], s['current_occupancy'] + magnitude)
                    
        elif scenario == 'evacuation':
            # Everyone leaves, bottleneck at exits
            for s in sector_data:
                s['current_occupancy'] = max(0, s['current_occupancy'] - int(s['capacity'] * 0.4))

        # Recalculate densities
        for s in sector_data:
            s['density'] = round((s['current_occupancy'] / s['capacity']) * 100, 2)
            if s['density'] > 90:
                s['status'] = 'critical'
            elif s['density'] > 75:
                s['status'] = 'warning'
            else:
                s['status'] = 'normal'

        return Response({
            "scenario_executed": scenario,
            "simulated_sectors": sector_data
        }, status=status.HTTP_200_OK)

class AgentStatusView(APIView):
    """
    Endpoint to get live status of agents based on active incidents in the database.
    """
    def get(self, request):
        agents = [
            {"id": "crowd", "label": "Crowd Agent", "type": "Crowd"},
            {"id": "gate", "label": "Gate Agent", "type": "System"}, # Assuming Gate fits under system or Crowd
            {"id": "comm", "label": "Communication Agent", "type": "System"},
            {"id": "security", "label": "Security Agent", "type": "Security"},
            {"id": "medical", "label": "Medical Agent", "type": "Medical"},
            {"id": "weather", "label": "Weather Agent", "type": "Weather"},
            {"id": "emergency", "label": "Emergency Agent", "type": "System"},
        ]
        
        # Check active incidents
        active_incidents = Incident.objects.exclude(status='resolved')
        
        results = []
        for agent in agents:
            # Check if there are any incidents of this agent's type
            agent_incidents = active_incidents.filter(type=agent["type"])
            
            if not agent_incidents.exists():
                status_label = "Standby" if agent["id"] == "emergency" else "Healthy"
                color = "gray" if agent["id"] == "emergency" else "green"
            else:
                # Check highest severity
                severities = [inc.severity for inc in agent_incidents]
                if 'critical' in severities:
                    status_label = "Critical"
                    color = "red"
                elif 'high' in severities:
                    status_label = "Active"
                    color = "blue"
                else:
                    status_label = "Warning"
                    color = "orange"
                    
            results.append({
                "id": agent["id"],
                "label": agent["label"],
                "status": status_label,
                "color": color
            })
            
        return Response(results, status=status.HTTP_200_OK)



from .models import AgentFeedback, ModelVersion, SustainabilityMetric, IncidentBiasAudit
from .serializers import (AgentFeedbackSerializer, ModelVersionSerializer, 
                          SustainabilityMetricSerializer, IncidentBiasAuditSerializer)

class AgentFeedbackViewSet(viewsets.ModelViewSet):
    queryset = AgentFeedback.objects.all()
    serializer_class = AgentFeedbackSerializer

class ModelVersionViewSet(viewsets.ModelViewSet):
    queryset = ModelVersion.objects.all()
    serializer_class = ModelVersionSerializer

class SustainabilityMetricViewSet(viewsets.ModelViewSet):
    queryset = SustainabilityMetric.objects.all()
    serializer_class = SustainabilityMetricSerializer

class IncidentBiasAuditViewSet(viewsets.ModelViewSet):
    queryset = IncidentBiasAudit.objects.all()
    serializer_class = IncidentBiasAuditSerializer

from .models import AgentConfig
from .serializers import AgentConfigSerializer

class AgentConfigViewSet(viewsets.ModelViewSet):
    queryset = AgentConfig.objects.all()
    serializer_class = AgentConfigSerializer
    lookup_field = 'agent_id'
