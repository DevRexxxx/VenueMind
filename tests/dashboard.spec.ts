import { test, expect } from '@playwright/test';

test.describe('VenueMind Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming the app runs on localhost:3000 during tests
    await page.goto('http://localhost:3000');
  });

  test('should load the dashboard and display key components', async ({ page }) => {
    // Check if header is visible
    await expect(page.locator('header[role="banner"]')).toBeVisible();

    // Check if the Digital Twin renders
    await expect(page.locator('text="Live Stadium Digital Twin"')).toBeVisible();

    // Check if the Agent Network renders
    await expect(page.locator('text="AI Agent Network"')).toBeVisible();

    // Check if the ROI Metrics renders
    await expect(page.locator('text="Business Viability & ROI"')).toBeVisible();

    // Check if the Command Assistant renders
    const copilotInput = page.getByPlaceholder(/Command Orchestrator/i);
    await expect(copilotInput).toBeVisible();
  });

  test('should toggle the sidebar', async ({ page }) => {
    const sidebar = page.locator('aside');
    const toggleButton = page.locator('button[aria-label="Collapse sidebar"], button[aria-label="Expand sidebar"]');
    
    // Check initial state (should be visible)
    await expect(sidebar).toBeVisible();

    // Click toggle
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      // We don't check for exact width here, just that it didn't crash
      await expect(sidebar).toBeVisible();
    }
  });

  test('command assistant should accept input', async ({ page }) => {
    const copilotInput = page.getByPlaceholder(/Command Orchestrator/i);
    await copilotInput.fill('Evacuate Sector N1');
    await expect(copilotInput).toHaveValue('Evacuate Sector N1');
  });
});
