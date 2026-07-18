import { z } from "zod";

export const IncidentSchema = z.object({
  id: z.number().optional(),
  type: z.string(),
  description: z.string(),
  severity: z.string(),
  status: z.string(),
  created_at: z.string().optional(),
  reasoning_trace: z.string().optional(),
});

export type Incident = z.infer<typeof IncidentSchema>;

export const PaginatedIncidentSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(IncidentSchema),
});

export const AgentStatusSchema = z.object({
  id: z.string(),
  label: z.string(),
  status: z.string(),
  color: z.string(),
});

export type AgentStatus = z.infer<typeof AgentStatusSchema>;

export const SectorResultSchema = z.object({
  name: z.string(),
  density: z.number(),
  status: z.string(),
  current_occupancy: z.number().optional(),
  capacity: z.number().optional(),
});

export type SectorResult = z.infer<typeof SectorResultSchema>;

export const SimulationResponseSchema = z.object({
  scenario_executed: z.string(),
  simulated_sectors: z.array(SectorResultSchema),
});

export type SimulationResponse = z.infer<typeof SimulationResponseSchema>;
