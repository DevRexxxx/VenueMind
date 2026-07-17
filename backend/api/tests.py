from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Stadium, Sector, Gate, Staff, Incident

class APITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create base data
        self.stadium = Stadium.objects.create(name="Test Stadium", location="Test City", capacity=50000)
        self.sector = Sector.objects.create(stadium=self.stadium, name="Test Sector", max_density=1000)
        self.gate = Gate.objects.create(identifier="Test Gate", sector=self.sector, status="open", throughput_capacity=50)
        self.staff = Staff.objects.create(name="Test Guard", role="Security", sector=self.sector)
        self.incident = Incident.objects.create(
            type="Security", severity="high", description="Test Alert", 
            sector=self.sector, assigned_staff=self.staff
        )

    def test_get_stadiums(self):
        response = self.client.get('/api/stadiums/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Test Stadium")

    def test_create_stadium(self):
        data = {"name": "New Stadium", "location": "New City", "capacity": 60000}
        response = self.client.post('/api/stadiums/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Stadium.objects.count(), 2)

    def test_get_incidents(self):
        response = self.client.get('/api/incidents/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['type'], "Security")
        self.assertEqual(response.data[0]['severity'], "high")

    def test_update_incident_status(self):
        data = {"status": "resolved"}
        response = self.client.patch(f'/api/incidents/{self.incident.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.incident.refresh_from_db()
        self.assertEqual(self.incident.status, "resolved")
        
    def test_get_gates(self):
        response = self.client.get('/api/gates/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['identifier'], "Test Gate")
        self.assertEqual(response.data[0]['status'], "open")
