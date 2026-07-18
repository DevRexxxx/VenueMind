from api.models import Sector
from api.serializers import SectorSerializer

class SimulationService:
    VALID_SCENARIOS = ['gate_closure', 'surge', 'evacuation']

    @classmethod
    def run_scenario(cls, scenario: str, options: dict = None) -> dict:
        """
        Executes a simulation scenario and returns updated sector data.
        """
        if options is None:
            options = {}
            
        if scenario not in cls.VALID_SCENARIOS:
            raise ValueError(f"Invalid scenario. Must be one of: {', '.join(cls.VALID_SCENARIOS)}")
            
        sectors = Sector.objects.all()
        sector_data = SectorSerializer(sectors, many=True).data
        
        # Initialize mock values since they are not in the model
        for s in sector_data:
            s['capacity'] = s.get('max_density', 5000)
            s['current_occupancy'] = int(s['capacity'] * 0.6) # Default to 60% full
        
        # Simulate logic (mock algorithms)
        if scenario == 'gate_closure':
            gate_id = options.get('gate_id', 3)
            # Assume Gate 3 feeds Sector S1 and S2. If closed, S3 and S4 take the load.
            for s in sector_data:
                if s['name'] in ['S1', 'S2']:
                    s['current_occupancy'] = max(0, s['current_occupancy'] - 500)
                elif s['name'] in ['S3', 'S4']:
                    s['current_occupancy'] = min(s['capacity'], s['current_occupancy'] + 500)
                    
        elif scenario == 'surge':
            magnitude = options.get('magnitude', 1000)
            sector_name = options.get('sector_name', 'N1')
            for s in sector_data:
                if s['name'] == sector_name:
                    s['current_occupancy'] = min(s['capacity'], s['current_occupancy'] + magnitude)
                    
        elif scenario == 'evacuation':
            # Everyone leaves, bottleneck at exits
            for s in sector_data:
                s['current_occupancy'] = max(0, s['current_occupancy'] - int(s['capacity'] * 0.4))

        # Recalculate densities
        for s in sector_data:
            capacity = s.get('capacity', 1) or 1  # Prevent division by zero
            s['density'] = round((s['current_occupancy'] / capacity) * 100, 2)
            if s['density'] > 90:
                s['status'] = 'critical'
            elif s['density'] > 75:
                s['status'] = 'warning'
            else:
                s['status'] = 'normal'

        return sector_data
