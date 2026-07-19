import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility & Contrast Audit', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API responses to prevent "Failed to fetch" errors
    await page.route('**/agent-status/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: "crowd", label: "Crowd Agent", status: "Healthy", color: "green" }
        ])
      });
    });

    await page.route('**/incidents/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              type: "test",
              description: "Mock incident",
              severity: "low",
              status: "active",
              created_at: new Date().toISOString()
            }
          ]
        })
      });
    });

    await page.routeWebSocket('**/dashboard/', ws => {
      // Dummy ws handling
    });

    // Mock ROI metrics
    await page.route('**/roi-metrics/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total_incidents: 100,
          resolved_incidents: 95,
          active_incidents: 5,
          prevention_rate_pct: 95.0,
          avg_resolution_time_seconds: 300,
          total_staff: 50,
          active_staff: 45,
          staff_utilisation_pct: 90.0,
          ai_trust_score_pct: 98.5,
          total_feedback: 200,
          severity_breakdown: { low: 50, medium: 30, high: 15, critical: 5 }
        })
      });
    });

    await page.goto('http://localhost:3000');
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    // Wait for main dashboard to be fully rendered
    await page.waitForSelector('text="Live Stadium Digital Twin"');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // If there are contrast violations, print them out for the evaluation report
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility Violations Found:');
      accessibilityScanResults.violations.forEach(v => {
        console.log(`- [${v.id}] ${v.help} (${v.nodes.length} occurrences)`);
        if (v.id === 'color-contrast') {
          v.nodes.forEach(node => {
            console.log(`  Target: ${node.target.join(', ')}`);
            console.log(`  HTML: ${node.html}`);
            console.log(`  Reason: ${node.failureSummary}`);
          });
        }
      });
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
