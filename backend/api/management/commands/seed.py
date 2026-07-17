from django.core.management.base import BaseCommand
from api.models import Stadium, Sector, Gate, Staff, Incident

class Command(BaseCommand):
    help = 'Seeds the database with initial VenueMind mock data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database...")
        
        # Create Stadium
        stadium, created = Stadium.objects.get_or_create(
            name="Lusail Stadium",
            location="Doha",
            capacity=88966
        )
        
        # Create Sectors
        sector_n, _ = Sector.objects.get_or_create(stadium=stadium, name="Concourse North", max_density=5000)
        sector_s, _ = Sector.objects.get_or_create(stadium=stadium, name="Concourse South", max_density=5000)
        
        # Create Gates
        Gate.objects.get_or_create(identifier="A", sector=sector_n, status="open", throughput_capacity=100)
        Gate.objects.get_or_create(identifier="B", sector=sector_n, status="open", throughput_capacity=100)
        Gate.objects.get_or_create(identifier="C", sector=sector_s, status="closed", throughput_capacity=100)
        
        # Create Staff
        medic, _ = Staff.objects.get_or_create(name="Dr. Smith", role="Medical", sector=sector_n)
        guard, _ = Staff.objects.get_or_create(name="Officer Jones", role="Security", sector=sector_s)
        
        # Create Incidents
        Incident.objects.get_or_create(
            type="Security",
            severity="high",
            description="Unauthorized access attempt Gate C",
            status="dispatching",
            sector=sector_s,
            assigned_staff=guard
        )
        
        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
