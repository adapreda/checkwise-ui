# CheckWise

Multi-agent framework for high-precision content forensics. Uses a hybrid architecture of cloud-based web grounding and local statistical analysis to detect machine-generated patterns, rhythmic monotony, and factual hallucinations.

## Statistical Agent

The repository now includes a Python statistical agent in [`checkwise_stats/`](./checkwise_stats) and a minimal backend API in [`backend/`](./backend). The intended application path is now:

1. frontend sends a statistical question and dataset to `/api/statistics/analyze`
2. FastAPI backend receives the request
3. backend calls the LangGraph statistical agent
4. frontend renders the returned answer and structured results inside the existing checker page

### What it doess

- Accepts a user question plus a pandas `DataFrame` or file-backed dataset
- Uses LangGraph with these nodes:
  - `parse_request`
  - `inspect_data`
  - `select_method`
  - `run_analysis`
  - `explain_results`
- Uses `ChatOllama(model="gpt-oss:20b", base_url="http://localhost:11434", temperature=0)`
- Uses the LLM only for intent detection and explanation
- Runs deterministic Python code for descriptive statistics, Welch t-tests, and chi-square tests

### Install Python dependencies

```bash
pip install -r requirements-statistical-agent.txt
```

### Run the full app integration

```bash
pip install -r requirements-statistical-agent.txt
npm run backend
npm run dev
```

The frontend runs on `http://localhost:8080` and proxies `/api` requests to the Python backend on `http://localhost:8000`.

### Optional CLI testing

```bash
python -m checkwise_stats.cli --question "Describe the age column" --data path/to/data.csv --show-state
```

The CLI remains available for local testing only. It is no longer the main integration path for the app.

### End-to-end test

1. Start Ollama and confirm `gpt-oss:20b` is available on `http://localhost:11434`
2. Start the backend with `npm run backend`
3. Start the frontend with `npm run dev`
4. Sign in through the existing auth page
5. On the checker page, use the new Statistical Agent panel
6. Try one of the suggested questions such as `Compare score between the control and treatment groups.`

## CI/CD Pipeline

This repository includes a simple GitHub Actions CI/CD setup for the MDS pipeline requirement.

The CI workflow is located in `.github/workflows/ci.yml`. It runs on every push and pull request targeting `main` or `develop`. The workflow checks out the repository, sets up Python 3.12, installs the backend dependencies from `requirements-statistical-agent.txt`, and runs the backend tests with `pytest backend/tests`. It also sets up Node.js 20, installs the frontend dependencies with `npm ci`, and builds the Vite frontend with `npm run build`.

The CD workflow is located in `.github/workflows/cd.yml`. It runs on every push to `main`. The workflow repeats the backend validation, builds the frontend, creates a release folder, and uploads it as a GitHub Actions artifact named `application-release`.

For the university demo, this satisfies the MDS CI/CD requirement because the project automatically validates backend tests and frontend build on code changes, and it produces a downloadable delivery artifact from the `main` branch.
