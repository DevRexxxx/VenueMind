from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (StadiumViewSet, SectorViewSet, GateViewSet, StaffViewSet, 
                    IncidentViewSet, AlertViewSet, AssetViewSet, CrowdMetricSnapshotViewSet,
                    AgentQueryView, AgentFeedbackViewSet, ModelVersionViewSet, 
                    SustainabilityMetricViewSet, IncidentBiasAuditViewSet, SimulateView, AgentStatusView)

router = DefaultRouter()
router.register(r'stadiums', StadiumViewSet)
router.register(r'sectors', SectorViewSet)
router.register(r'gates', GateViewSet)
router.register(r'staff', StaffViewSet)
router.register(r'incidents', IncidentViewSet)
router.register(r'alerts', AlertViewSet)
router.register(r'assets', AssetViewSet)
router.register(r'crowd-metrics', CrowdMetricSnapshotViewSet)
router.register(r'agent-feedback', AgentFeedbackViewSet)
router.register(r'model-versions', ModelVersionViewSet)
router.register(r'sustainability-metrics', SustainabilityMetricViewSet)
router.register(r'incident-bias-audits', IncidentBiasAuditViewSet)

from .views import AgentConfigViewSet
router.register(r'agent-config', AgentConfigViewSet, basename='agent-config')

urlpatterns = [
    path('agent-query/', AgentQueryView.as_view(), name='agent-query'),
    path('simulate/', SimulateView.as_view(), name='simulate'),
    path('agent-status/', AgentStatusView.as_view(), name='agent-status'),
    path('', include(router.urls)),
]
