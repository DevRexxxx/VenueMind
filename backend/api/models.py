from django.db import models

class Stadium(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    capacity = models.IntegerField()
    
    def __str__(self):
        return self.name

class Sector(models.Model):
    stadium = models.ForeignKey(Stadium, on_delete=models.CASCADE, related_name='sectors')
    name = models.CharField(max_length=50)
    max_density = models.IntegerField(help_text="Maximum safe occupancy threshold")
    
    def __str__(self):
        return f"{self.stadium.name} - {self.name}"

class Gate(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('maintenance', 'Maintenance'),
    ]
    identifier = models.CharField(max_length=50)
    sector = models.ForeignKey(Sector, on_delete=models.CASCADE, related_name='gates')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='closed')
    throughput_capacity = models.IntegerField(help_text="People per minute")
    
    def __str__(self):
        return f"Gate {self.identifier}"

class Staff(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=50) # e.g. Security, Medical, Traffic
    sector = models.ForeignKey(Sector, null=True, blank=True, on_delete=models.SET_NULL, related_name='staff')
    status = models.CharField(max_length=20, default='active') # active, busy, offline
    
    def __str__(self):
        return f"{self.name} ({self.role})"

class Incident(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    STATUS_CHOICES = [
        ('detected', 'Detected'),
        ('dispatching', 'Dispatching'),
        ('in-progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]
    type = models.CharField(max_length=50) # Security, Medical, Crowd, Maintenance
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='detected')
    sector = models.ForeignKey(Sector, null=True, blank=True, on_delete=models.SET_NULL)
    assigned_staff = models.ForeignKey(Staff, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.type} Incident - {self.status}"

class Alert(models.Model):
    source_agent = models.CharField(max_length=50)
    severity = models.CharField(max_length=20)
    message = models.TextField()
    incident = models.ForeignKey(Incident, null=True, blank=True, on_delete=models.CASCADE, related_name='alerts')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Alert from {self.source_agent}"

class Asset(models.Model):
    STATUS_CHOICES = [
        ('operational', 'Operational'),
        ('maintenance', 'Maintenance'),
        ('offline', 'Offline'),
    ]
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50) # Scanner, Camera, Turnstile
    sector = models.ForeignKey(Sector, null=True, blank=True, on_delete=models.SET_NULL)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='operational')
    
    def __str__(self):
        return f"{self.name} ({self.status})"

class CrowdMetricSnapshot(models.Model):
    sector = models.ForeignKey(Sector, on_delete=models.CASCADE)
    density = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.sector.name} - {self.density} at {self.timestamp}"

class AgentFeedback(models.Model):
    RATING_CHOICES = [
        ('thumbs_up', 'Thumbs Up'),
        ('thumbs_down', 'Thumbs Down'),
    ]
    alert = models.ForeignKey(Alert, on_delete=models.CASCADE, related_name='feedback')
    supervisor = models.CharField(max_length=100) # In real app, ForeignKey to User
    rating = models.CharField(max_length=20, choices=RATING_CHOICES)
    feedback_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Feedback by {self.supervisor} on {self.alert.source_agent}"

class ModelVersion(models.Model):
    agent_name = models.CharField(max_length=50)
    version_tag = models.CharField(max_length=20)
    is_active = models.BooleanField(default=False)
    deployed_at = models.DateTimeField(auto_now_add=True)
    rollback_notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.agent_name} - {self.version_tag} (Active: {self.is_active})"

class SustainabilityMetric(models.Model):
    category = models.CharField(max_length=50) # carbon, energy, water, waste
    value = models.FloatField()
    unit = models.CharField(max_length=20)
    carbon_offset_mapping = models.FloatField(help_text="Equivalent carbon offset value", null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.category}: {self.value}{self.unit}"

class IncidentBiasAudit(models.Model):
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE)
    auditor = models.CharField(max_length=100)
    audit_notes = models.TextField()
    is_biased = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Audit for {self.incident} by {self.auditor}"

class AgentConfig(models.Model):
    agent_id = models.CharField(max_length=50, unique=True)
    autonomy_level = models.CharField(max_length=20, default='advisory') # 'advisory', 'autonomous'
    model_engine = models.CharField(max_length=50, default='gpt-4o-mini')
    temperature = models.FloatField(default=0.2)
    confidence_threshold = models.IntegerField(default=92)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.agent_id} Config"
