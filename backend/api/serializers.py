from rest_framework import serializers
from .models import (
    Stadium, Sector, Gate, Staff, Incident, Alert, Asset, CrowdMetricSnapshot,
    AgentFeedback, ModelVersion, SustainabilityMetric, IncidentBiasAudit, AgentConfig
)

class StadiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stadium
        fields = '__all__'

class SectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sector
        fields = '__all__'

class GateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gate
        fields = '__all__'

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = '__all__'

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'

class CrowdMetricSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrowdMetricSnapshot
        fields = '__all__'

class AgentFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentFeedback
        fields = '__all__'

class ModelVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelVersion
        fields = '__all__'

class SustainabilityMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = SustainabilityMetric
        fields = '__all__'

class IncidentBiasAuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidentBiasAudit
        fields = '__all__'

class AgentConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentConfig
        fields = '__all__'

