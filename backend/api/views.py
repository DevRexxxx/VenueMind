import os
import logging

from django.conf import settings as django_settings
from django.db.models import Count, F
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser
from rest_framework.throttling import UserRateThrottle
from .models import (
    Stadium, Sector, Gate, Staff, Incident, Alert, Asset, CrowdMetricSnapshot,
    AgentFeedback, ModelVersion, SustainabilityMetric, IncidentBiasAudit, AgentConfig
)
from .serializers import (
    StadiumSerializer, SectorSerializer, GateSerializer, StaffSerializer,
    IncidentSerializer, AlertSerializer, AssetSerializer, CrowdMetricSnapshotSerializer,
    AgentFeedbackSerializer, ModelVersionSerializer, SustainabilityMetricSerializer,
    IncidentBiasAuditSerializer, AgentConfigSerializer
)
from .services import SimulationService

logger = logging.getLogger(__name__)


class StadiumViewSet(viewsets.ModelViewSet):
    queryset = Stadium.objects.all().order_by('id')
    serializer_class = StadiumSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class SectorViewSet(viewsets.ModelViewSet):
    queryset = Sector.objects.select_related('stadium').all().order_by('id')
    serializer_class = SectorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class GateViewSet(viewsets.ModelViewSet):
    queryset = Gate.objects.select_related('sector', 'sector__stadium').all().order_by('id')
    serializer_class = GateSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.select_related('sector').all().order_by('id')
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.select_related('sector', 'assigned_staff').all().order_by('-created_at')
    serializer_class = IncidentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.select_related('incident').all().order_by('-created_at')
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.select_related('sector').all().order_by('id')
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CrowdMetricSnapshotViewSet(viewsets.ModelViewSet):
    queryset = CrowdMetricSnapshot.objects.select_related('sector').all().order_by('-timestamp')
    serializer_class = CrowdMetricSnapshotSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class AgentFeedbackViewSet(viewsets.ModelViewSet):
    queryset = AgentFeedback.objects.select_related('alert').all().order_by('-created_at')
    serializer_class = AgentFeedbackSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ModelVersionViewSet(viewsets.ModelViewSet):
    queryset = ModelVersion.objects.all().order_by('-deployed_at')
    serializer_class = ModelVersionSerializer
    permission_classes = [IsAdminUser]

class SustainabilityMetricViewSet(viewsets.ModelViewSet):
    queryset = SustainabilityMetric.objects.all().order_by('-timestamp')
    serializer_class = SustainabilityMetricSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class IncidentBiasAuditViewSet(viewsets.ModelViewSet):
    queryset = IncidentBiasAudit.objects.select_related('incident').all().order_by('-created_at')
    serializer_class = IncidentBiasAuditSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class AgentConfigViewSet(viewsets.ModelViewSet):
    queryset = AgentConfig.objects.all().order_by('id')
    serializer_class = AgentConfigSerializer
    lookup_field = 'agent_id'
    permission_classes = [IsAdminUser]


# --- Custom rate limiter for AI queries ---
class AgentQueryThrottle(UserRateThrottle):
    """Stricter rate limit for AI Orchestrator queries to prevent abuse."""
    rate = '10/minute'


class AgentQueryView(APIView):
    """
    Endpoint to send a natural language query to the LangGraph AI Orchestrator.

    Secured: Requires authentication.
    Rate-limited and input-validated.
    Async processing is delegated to Celery to avoid unmanaged threads.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [AgentQueryThrottle]

    MAX_QUERY_LENGTH = 500

    def post(self, request):
        query = request.data.get('query', '').strip()

        if not query:
            return Response({"error": "No query provided."}, status=status.HTTP_400_BAD_REQUEST)

        if len(query) > self.MAX_QUERY_LENGTH:
            return Response(
                {"error": f"Query must be {self.MAX_QUERY_LENGTH} characters or fewer."},
                status=status.HTTP_400_BAD_REQUEST
            )

        api_key = os.environ.get("GROQ_API_KEY", "dummy_key")
        if api_key == "dummy_key":
            return Response(
                {"error": "Groq API key is missing. Please add GROQ_API_KEY to your Render Environment Variables to use the AI features for free."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Delegate to Celery task instead of spawning a raw thread
        from .tasks import process_llm_query_task
        process_llm_query_task.delay(query)

        return Response({"status": "processing", "message": "Query received. Analyzing..."}, status=status.HTTP_202_ACCEPTED)

class SimulateView(APIView):
    """
    Endpoint for Digital Twin "What-If" Simulation Engine.

    Secured: Requires authentication.
    Accepts scenarios like 'gate_closure' or 'surge' and returns updated sector densities.
    """
    permission_classes = [IsAuthenticated]

    VALID_SCENARIOS = ['gate_closure', 'surge', 'evacuation']

    def post(self, request):
        scenario = request.data.get('scenario', '').strip()
        
        if not scenario:
            return Response({"error": "No scenario provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            sector_data = SimulationService.run_scenario(scenario, options=request.data)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "scenario_executed": scenario,
            "simulated_sectors": sector_data
        }, status=status.HTTP_200_OK)

class AgentStatusView(APIView):
    """
    Endpoint to get live status of agents based on active incidents in the database.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        # Fetch active agents dynamically from configuration
        agent_configs = AgentConfig.objects.all()
        
        # Mapping configured agents to display structure
        agents = []
        for config in agent_configs:
            label = f"{config.agent_id} Agent"
            agent_type = config.agent_id # Assuming Agent ID directly correlates with incident Type
            agents.append({
                "id": config.agent_id.lower(),
                "label": label,
                "type": agent_type
            })

        # Fallback to default agents from settings if DB is empty
        if not agents:
            agents = list(django_settings.DEFAULT_AGENT_STATUSES)
        
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


class ROIMetricsView(APIView):
    """
    Endpoint for Business Viability & ROI metrics.

    Aggregates key operational data from the database:
    - Total incidents detected and resolved
    - Average resolution time
    - Staff utilisation rate
    - AI agent feedback summary (trust score)
    """
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        total_incidents = Incident.objects.count()
        resolved_incidents = Incident.objects.filter(status='resolved').count()
        active_incidents = Incident.objects.exclude(status='resolved').count()

        # Prevention rate: resolved / total (if any exist)
        prevention_rate = round((resolved_incidents / total_incidents * 100), 1) if total_incidents > 0 else 0.0

        # Average resolution time — portable approach that works on both PostgreSQL and SQLite.
        # Uses .only() to minimise column data fetched; aggregates the timedelta arithmetic
        # in Python on the two datetime scalars rather than pulling full model instances.
        resolved_qs = Incident.objects.filter(status='resolved', resolved_at__isnull=False)
        resolved_count = resolved_qs.count()
        avg_resolution = None
        if resolved_count > 0:
            total_seconds = sum(
                (inc.resolved_at - inc.created_at).total_seconds()
                for inc in resolved_qs.only('resolved_at', 'created_at')
            )
            avg_resolution = round(total_seconds / resolved_count, 1)

        # Staff utilisation: active or busy staff / total staff
        total_staff = Staff.objects.count()
        active_staff = Staff.objects.filter(status__in=['active', 'busy']).count()
        staff_utilisation = round((active_staff / total_staff * 100), 1) if total_staff > 0 else 0.0

        # AI trust score: ratio of positive feedback
        total_feedback = AgentFeedback.objects.count()
        positive_feedback = AgentFeedback.objects.filter(rating='thumbs_up').count()
        ai_trust_score = round((positive_feedback / total_feedback * 100), 1) if total_feedback > 0 else None

        # Incidents by severity breakdown
        severity_breakdown = dict(
            Incident.objects.values_list('severity').annotate(count=Count('id')).values_list('severity', 'count')
        )

        return Response({
            "total_incidents": total_incidents,
            "resolved_incidents": resolved_incidents,
            "active_incidents": active_incidents,
            "prevention_rate_pct": prevention_rate,
            "avg_resolution_time_seconds": avg_resolution,
            "total_staff": total_staff,
            "active_staff": active_staff,
            "staff_utilisation_pct": staff_utilisation,
            "ai_trust_score_pct": ai_trust_score,
            "total_feedback": total_feedback,
            "severity_breakdown": severity_breakdown,
        }, status=status.HTTP_200_OK)
