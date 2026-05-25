import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Rulează testele în paralel */
  fullyParallel: true,
  /* Reîncearcă o dată dacă pică pe GitHub */
  retries: process.env.CI ? 1 : 0,
  /* Pe GitHub folosim mai puțini workeri pentru stabilitate */
  workers: process.env.CI ? 1 : undefined,
  use: {
    /* Base URL-ul pe care l-ai setat în GitHub Actions */
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});