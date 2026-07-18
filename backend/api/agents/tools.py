from langchain_core.tools import tool
from api.models import Sector, Gate, Staff, Incident
import random

@tool
def get_sector_status(sector_name: str) -> str:
    """Returns the current status, gates, and staff assigned to a sector."""
    try:
        sector = Sector.objects.get(name__icontains=sector_name)
        gates = sector.gates.all()
        gate_status = ", ".join([f"Gate {g.identifier} ({g.status})" for g in gates])
        
        staff = sector.staff.all()
        staff_status = ", ".join([f"{s.name} ({s.role})" for s in staff])
        
        return f"Sector: {sector.name}. Gates: {gate_status}. Staff: {staff_status}."
    except Sector.DoesNotExist:
        return f"Sector {sector_name} not found."

@tool
def check_active_incidents(sector_name: str) -> str:
    """Check for active incidents in a specific sector."""
    try:
        sector = Sector.objects.get(name__icontains=sector_name)
        incidents = Incident.objects.filter(sector=sector).exclude(status='resolved')
        if not incidents.exists():
            return f"No active incidents in {sector.name}."
        
        results = []
        for i in incidents:
            results.append(f"[{i.severity.upper()}] {i.type}: {i.description} (Status: {i.status})")
        return "\n".join(results)
    except Sector.DoesNotExist:
        return f"Sector {sector_name} not found."

@tool
def get_available_staff(role: str) -> str:
    """Get a list of available staff by role (e.g. Security, Medical)."""
    staff = Staff.objects.filter(role__icontains=role, status='active')
    if not staff.exists():
        return f"No active {role} staff available right now."
    
    return ", ".join([f"{s.name} (at {s.sector.name if s.sector else 'Base'})" for s in staff])

@tool
def get_microclimate_data(sector_name: str) -> str:
    """Gets hyper-local weather conditions for a specific sector (temperature, humidity)."""
    # Mock data for demonstration
    temp = random.randint(28, 36)
    return f"Sector {sector_name} microclimate: Temp {temp}°C, Humidity 65%, Heat Index {temp + 2}°C."

@tool
def trigger_heat_protocol(sector_name: str) -> str:
    """Triggers misting stations and hydration alerts in a sector."""
    return f"Heat protocol triggered in {sector_name}. Misting stations ON. Medics notified."

@tool
def check_accessible_routes() -> str:
    """Checks the status of wheelchair-accessible routes and elevators across the stadium."""
    return "All main accessibility routes clear. Elevator 4 (Sector East) is DOWN for maintenance."

@tool
def get_sensory_zone_capacity() -> str:
    """Checks capacity of sensory-friendly zones."""
    return "Sensory Zone A (North) is at 80% capacity. Sensory Zone B (South) is at 30% capacity."

@tool
def scan_ticket_anomalies() -> str:
    """Detects black-market resale patterns or duplicate ticket scans at the gates."""
    return "Detected 4 duplicate ticket scans at Gate 7 within the last 5 minutes. IP origins match known scalper botnets."

@tool
def predict_concession_stockouts() -> str:
    """Predicts concession stockouts using time-of-day and weather patterns."""
    return "Predicting water stockout at Concession Block C in 15 minutes due to localized heat index (33°C). Recommend dispatching 2 pallets immediately."

@tool
def calculate_evacuation_time(sector_name: str) -> str:
    """Calculates estimated evacuation time for a sector based on current live density."""
    try:
        sector = Sector.objects.get(name__icontains=sector_name)
        # Use max_density as the capacity reference (the field that exists on the model)
        max_density = sector.max_density or 1
        # Get latest crowd metric snapshot for current density estimate
        from api.models import CrowdMetricSnapshot
        latest_snapshot = CrowdMetricSnapshot.objects.filter(sector=sector).order_by('-timestamp').first()
        current_density = latest_snapshot.density if latest_snapshot else 50  # Default to 50% if no data
        time_estimate = round(current_density * 0.15, 1)  # simple mock formula
        return f"Estimated evacuation time for {sector.name} is {time_estimate} minutes (density: {current_density}%, max capacity: {max_density})."
    except Sector.DoesNotExist:
        return f"Sector {sector_name} not found."

