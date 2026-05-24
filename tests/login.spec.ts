name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  release:
    name: Test and Build Release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      # --- BACKEND SETUP & TESTS ---
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install backend dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements-statistical-agent.txt
          pip install fastapi uvicorn pytest  # Ne asigurăm că avem și serverul de test

      - name: Run backend tests
        run: pytest backend/tests

      # --- FRONTEND SETUP ---
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm

      - name: Install frontend dependencies
        run: npm ci

      # --- E2E PLAYWRIGHT TESTS ---
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Start services in background
        run: |
          # Pornim backend-ul pe portul 8000
          python -m uvicorn backend.app:app --port 8000 &
          # Pornim frontend-ul în mod development/preview
          npm run dev &
          # Așteptăm să fie ambele gata
          sleep 5

      - name: Run Playwright E2E Login Tests
        run: npx playwright test tests/login.spec.ts

      # --- BUILD & RELEASE (rulează doar dacă testele trec) ---
      - name: Build frontend
        run: npm run build

      - name: Create release folder
        run: |
          mkdir -p release/backend release/checkwise_stats
          cp backend/*.py release/backend/
          cp checkwise_stats/*.py release/checkwise_stats/
          cp -R dist release/frontend-dist
          cp requirements-statistical-agent.txt release/
          cp package.json package-lock.json release/
          cp README.md release/

      - name: Upload release artifact
        uses: actions/upload-artifact@v4
        with:
          name: application-release
          path: release
