from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Stadium, Sector, Gate, Staff, Incident, AgentConfig, Alert, AgentFeedback


class StadiumAPITests(TestCase):
    """Tests for Stadium CRUD endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.stadium = Stadium.objects.create(name="Test Stadium", location="Test City", capacity=50000)

    def test_get_stadiums(self):
        response = self.client.get('/api/stadiums/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], "Test Stadium")

    def test_get_stadium_detail(self):
        response = self.client.get(f'/api/stadiums/{self.stadium.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Test Stadium")
        self.assertEqual(response.data['capacity'], 50000)

    def test_stadium_str(self):
        self.assertEqual(str(self.stadium), "Test Stadium")


class IncidentAPITests(TestCase):
    """Tests for Incident CRUD and status management."""

    def setUp(self):
        self.client = APIClient()
        self.stadium = Stadium.objects.create(name="Test Stadium", location="Test City", capacity=50000)
        self.sector = Sector.objects.create(stadium=self.stadium, name="N1", max_density=1000)
        self.staff = Staff.objects.create(name="Test Guard", role="Security", sector=self.sector)
        self.incident = Incident.objects.create(
            type="Security", severity="high", description="Unauthorized access detected",
            sector=self.sector, assigned_staff=self.staff
        )
        self.user = User.objects.create_user(username="testadmin", password="password")

    def test_get_incidents(self):
        response = self.client.get('/api/incidents/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['type'], "Security")
        self.assertEqual(response.data['results'][0]['severity'], "high")

    def test_update_incident_status(self):
        self.client.force_authenticate(user=self.user)
        data = {"status": "resolved"}
        response = self.client.patch(f'/api/incidents/{self.incident.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.incident.refresh_from_db()
        self.assertEqual(self.incident.status, "resolved")

    def test_incident_str(self):
        self.assertEqual(str(self.incident), "Security Incident - detected")

    def test_incident_default_status(self):
        self.assertEqual(self.incident.status, "detected")


class GateAPITests(TestCase):
    """Tests for Gate endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.stadium = Stadium.objects.create(name="Test Stadium", location="Test City", capacity=50000)
        self.sector = Sector.objects.create(stadium=self.stadium, name="N1", max_density=1000)
        self.gate = Gate.objects.create(identifier="Gate 1", sector=self.sector, status="open", throughput_capacity=50)

    def test_get_gates(self):
        response = self.client.get('/api/gates/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['identifier'], "Gate 1")
        self.assertEqual(response.data['results'][0]['status'], "open")

    def test_gate_str(self):
        self.assertEqual(str(self.gate), "Gate Gate 1")


class AgentQueryViewTests(TestCase):
    """Tests for the AI Orchestrator query endpoint — input validation and error handling."""

    def setUp(self):
        self.client = APIClient()

    def test_query_missing_body(self):
        """Should return 400 when no query is provided."""
        response = self.client.post('/api/agent-query/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_query_empty_string(self):
        """Should return 400 for empty string query."""
        response = self.client.post('/api/agent-query/', {"query": ""}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_query_whitespace_only(self):
        """Should return 400 for whitespace-only query."""
        response = self.client.post('/api/agent-query/', {"query": "   "}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_query_too_long(self):
        """Should return 400 when query exceeds max length."""
        long_query = "a" * 501
        response = self.client.post('/api/agent-query/', {"query": long_query}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("500", response.data["error"])  # Should mention the max length

    def test_query_missing_api_key(self):
        """Should return 401 when GROQ_API_KEY is not set (defaults to dummy_key)."""
        response = self.client.post('/api/agent-query/', {"query": "What is the crowd status?"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Groq API key", response.data["error"])


class SimulateViewTests(TestCase):
    """Tests for the Digital Twin simulation endpoint."""

    def setUp(self):
        self.client = APIClient()
        self.stadium = Stadium.objects.create(name="Test Stadium", location="Test City", capacity=50000)
        self.sector1 = Sector.objects.create(stadium=self.stadium, name="S1", max_density=5000)
        self.sector2 = Sector.objects.create(stadium=self.stadium, name="S2", max_density=5000)
        self.sector3 = Sector.objects.create(stadium=self.stadium, name="S3", max_density=5000)

    def test_simulate_missing_scenario(self):
        """Should return 400 when no scenario is provided."""
        response = self.client.post('/api/simulate/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_simulate_invalid_scenario(self):
        """Should return 400 for an unknown scenario type."""
        response = self.client.post('/api/simulate/', {"scenario": "alien_invasion"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid scenario", response.data["error"])

    def test_simulate_evacuation_returns_sectors(self):
        """Should return sector data for a valid evacuation scenario."""
        response = self.client.post('/api/simulate/', {"scenario": "evacuation"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["scenario_executed"], "evacuation")
        self.assertIn("simulated_sectors", response.data)

    def test_simulate_gate_closure(self):
        """Should return 200 for gate_closure scenario."""
        response = self.client.post('/api/simulate/', {"scenario": "gate_closure"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["scenario_executed"], "gate_closure")

    def test_simulate_surge(self):
        """Should return 200 for surge scenario."""
        response = self.client.post('/api/simulate/', {"scenario": "surge"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["scenario_executed"], "surge")


class AgentStatusViewTests(TestCase):
    """Tests for the live agent status endpoint."""

    def setUp(self):
        self.client = APIClient()
        self.stadium = Stadium.objects.create(name="Test Stadium", location="Test City", capacity=50000)
        self.sector = Sector.objects.create(stadium=self.stadium, name="N1", max_density=1000)

    def test_agent_status_all_healthy(self):
        """When there are no active incidents, all agents should be Healthy/Standby."""
        response = self.client.get('/api/agent-status/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 7)
        # Check that emergency agent is Standby and others are Healthy
        for agent in response.data:
            if agent["id"] == "emergency":
                self.assertEqual(agent["status"], "Standby")
                self.assertEqual(agent["color"], "gray")
            else:
                self.assertEqual(agent["status"], "Healthy")
                self.assertEqual(agent["color"], "green")

    def test_agent_status_with_high_severity_incident(self):
        """When a high-severity Security incident exists, the Security Agent should show Active."""
        staff = Staff.objects.create(name="Guard", role="Security", sector=self.sector)
        Incident.objects.create(
            type="Security", severity="high", description="Breach attempt",
            sector=self.sector, assigned_staff=staff
        )
        response = self.client.get('/api/agent-status/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        security_agent = next(a for a in response.data if a["id"] == "security")
        self.assertEqual(security_agent["status"], "Active")
        self.assertEqual(security_agent["color"], "blue")

    def test_agent_status_with_critical_incident(self):
        """When a critical-severity incident exists, the corresponding agent should show Critical."""
        staff = Staff.objects.create(name="Medic", role="Medical", sector=self.sector)
        Incident.objects.create(
            type="Medical", severity="critical", description="Mass casualty event",
            sector=self.sector, assigned_staff=staff
        )
        response = self.client.get('/api/agent-status/')
        medical_agent = next(a for a in response.data if a["id"] == "medical")
        self.assertEqual(medical_agent["status"], "Critical")
        self.assertEqual(medical_agent["color"], "red")

    def test_resolved_incidents_dont_affect_status(self):
        """Resolved incidents should not affect agent status."""
        staff = Staff.objects.create(name="Guard", role="Security", sector=self.sector)
        Incident.objects.create(
            type="Security", severity="critical", description="Old incident",
            sector=self.sector, assigned_staff=staff, status="resolved"
        )
        response = self.client.get('/api/agent-status/')
        security_agent = next(a for a in response.data if a["id"] == "security")
        self.assertEqual(security_agent["status"], "Healthy")


class AgentConfigViewSetTests(TestCase):
    """Tests for agent configuration CRUD."""

    def setUp(self):
        self.client = APIClient()
        self.config = AgentConfig.objects.create(
            agent_id="Security",
            autonomy_level="advisory",
            model_engine="gpt-4o-mini",
            temperature=0.2,
            confidence_threshold=92
        )
        self.admin_user = User.objects.create_superuser('admin', 'admin@example.com', 'pass')
        self.client.force_authenticate(user=self.admin_user)

    def test_get_config_by_agent_id(self):
        """Should retrieve config by agent_id lookup."""
        response = self.client.get('/api/agent-config/Security/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['agent_id'], "Security")
        self.assertEqual(response.data['autonomy_level'], "advisory")

    def test_get_config_nonexistent(self):
        """Should return 404 for a non-existent agent config."""
        response = self.client.get('/api/agent-config/NonExistent/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_config_str(self):
        """Test model __str__ representation."""
        self.assertEqual(str(self.config), "Security Config")

    def test_agent_id_unique_constraint(self):
        """Should enforce unique agent_id at the database level."""
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            AgentConfig.objects.create(
                agent_id="Security",
                autonomy_level="autonomous"
            )


class ModelStringRepresentationTests(TestCase):
    """Tests for all model __str__ methods to ensure proper representation."""

    def setUp(self):
        self.stadium = Stadium.objects.create(name="MetLife Stadium", location="New Jersey", capacity=88966)
        self.sector = Sector.objects.create(stadium=self.stadium, name="N15", max_density=8200)
        self.gate = Gate.objects.create(identifier="7", sector=self.sector, status="open", throughput_capacity=60)
        self.staff = Staff.objects.create(name="John Doe", role="Security", sector=self.sector)
        self.incident = Incident.objects.create(
            type="Crowd", severity="medium", description="Surge at north stand",
            sector=self.sector, assigned_staff=self.staff
        )
        self.alert = Alert.objects.create(
            source_agent="CrowdAgent", severity="medium", message="Density threshold exceeded"
        )

    def test_stadium_str(self):
        self.assertEqual(str(self.stadium), "MetLife Stadium")

    def test_sector_str(self):
        self.assertEqual(str(self.sector), "MetLife Stadium - N15")

    def test_gate_str(self):
        self.assertEqual(str(self.gate), "Gate 7")

    def test_staff_str(self):
        self.assertEqual(str(self.staff), "John Doe (Security)")

    def test_incident_str(self):
        self.assertEqual(str(self.incident), "Crowd Incident - detected")

    def test_alert_str(self):
        self.assertEqual(str(self.alert), "Alert from CrowdAgent")

    def test_agent_feedback_str(self):
        feedback = AgentFeedback.objects.create(
            alert=self.alert, supervisor="Admin", rating="thumbs_up"
        )
        self.assertEqual(str(feedback), "Feedback by Admin on CrowdAgent")
