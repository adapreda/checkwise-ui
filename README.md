# CheckWise
CheckWise is a multi-agent framework designed for high-precision content forensics and automated text verification.
By utilizing a hybrid architecture, the platform combines real-time cloud-based web grounding with deep local statistical analysis to dissect text for credibility, structural integrity, and origin.

## Key Capabilities

 * Generative & Synthetic Pattern Detection: Uncovers machine-generated structures, tracking rhythmic monotony, repetitive syntax, and typical AI-authored signatures.
 * Factual Grounding & Hallucination Auditing: Deploys a team of specialized, coordinated agents—including Fact-Checking, Grammatical, and Statistical units—to cross-reference statements against live web databases, isolating factual hallucinations.
 * Smart URL Processing & Extraction: Seamlessly ingests and sanitizes raw articles, reports, or text files directly via URL extraction to deliver immediate, multi-layered credibility scores and highly detailed reasoning analytics.

## [App demo](https://github.com/AndraRaco/App-Receipt-Scanner/blob/master/Docs/app_test.mp4)

## Requirements

* Backend: Python 3.12+ (packages in requirements-statistical-agent.txt), SQLite (checkwise.db).
* Frontend: Node.js v20+ & npm (React with Vite).
* Testing: Playwright (requires npx playwright install --with-deps).

## Quick Start

Create a virtual environment, activate it, and install the required dependencies:
```
# Create virtual environment
python -m venv venv

# Activate on Windows (CMD)
call venv\Scripts\activate
# Activate on Windows (PowerShell)
# .\venv\Scripts\Activate.ps1
# Activate on macOS/Linux
# source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements-statistical-agent.txt

```

Install the Node.js packages in a separate terminal:
```
npm install
```
Start both services in separate terminal sessions:
```
# Ensure venv is active
python -m uvicorn backend.app:app --reload --port 8000
```

```
npm run dev
```
## Describing the app - (non-tehnical description - user stories, backlog creation, features list, design description, behavior description)

### 1. User stories
https://docs.google.com/document/d/1O0QkMZ_vKr_x_rvjXHyJ5c-q4CBUVyEVc0pRYqqXhHk/edit?tab=t.0

### 2. Backlog Creation

We monitorized our backlog creation using Trello. It can be found [here](https://trello.com/b/fLciePHL/receipt-scanner).

![](https://github.com/adapreda/CheckWise/blob/main/pictures/backlog1.png)
![](https://github.com/adapreda/CheckWise/blob/main/pictures/backlog2.png)

### 3. Features list

* Automated URL Text Extraction: Ingest and sanitize raw text from any webpage using high-performance scraping.
* Multi-Agent Evaluation: Coordinate specialized Fact-Checking, Grammatical, and Statistical agents to evaluate credibility.
* AI Content Forensics: Analyze linguistic patterns, syntax, and rhythmic monotony to identify synthetic (machine-generated) text.
* Factual Hallucination Auditing: Cross-reference extracted claims with live data to flag discrepancies and hallucinations.
* Multi-Layered Scoring System: Generate an intuitive, overall credibility score backed by granular analytical details.
* Interactive Dashboard: Seamlessly track verification history, visualize agent feedback, and review detailed reasoning.
* Comprehensive Testing Pipeline: Automated end-to-end user flow testing with Playwright alongside backend verification via Pytest.

### 4. App's behaviour description
Basically, the user can either opt for *pasting raw text* or *providing a URL* to be verified. If they choose to analyze a URL, the system will use a high-performance web scraper to *extract and clean the text content* from the source webpage. Either way, the platform dispatches the text into a *multi-agent evaluation pipeline*.

Within this pipeline, specialized coordinate agents—specifically the *Fact-Checking Agent*, the *Grammatical Agent*, and the *Statistical Agent*—work concurrently. The statistical engine *detects synthetic patterns, repetitive syntax, and rhythmic monotony* to identify if the text is AI-generated, while the fact-checking engine *cross-references claims against live web databases* to spot factual hallucinations.

Once the analysis is finalized, an *overall credibility score* is dynamically generated and displayed on the screen. Alongside this score, the user is presented with a detailed, interactive report containing *granular agent breakdowns, highlighted text snippets, and reasoning analytics*. The user can then explore the flags, inspect specific warnings, or clear the current analysis to start a new verification session.


### 5. UML Diagrams, Workflows, Components Arhitecture
It can be found [here](https://github.com/adapreda/CheckWise/blob/main/docs/ai-tools-report.md)

## Source control

**Branches**: https://github.com/adapreda/CheckWise/branches

- **branch branch-ada** -  contains statistical agent;<br>
- **branch alina** - contains database remastering and switch to ollama3.1:8b;<br>
- **branch marius** - contains fact-checing agent;<br>
- **branch fullagent** -  contains fact-checking agent clone;<br>
- **branch branch_2** -  contains code that allows the user to select an image from the gallery or to take a picture which will be scanned. The scanner is programmed to extract the name of the product and its price;<br>
- **branch url-processing** - contains the code for URL extraction and processing;<br>
- **branch fabi** - contains Gramatical Agent, UML diagrams, and AI usage report<br>


**Commits**: https://github.com/adapreda/CheckWise/commits


## CI/CD Pipeline and Automated tests
The project features an automated testing and continuous integration/continuous deployment (CI/CD) system configured using GitHub Actions.

### 1. Automated Testing
* **Backend (Pytest)**: Unit tests (e.g., `backend/tests/test_health.py`) verify API health using `TestClient`. Run with `pytest backend/tests`.
* **Frontend (Playwright):** Test (e.g., `tests/login.spec.ts`) simulate a real user accessing  `http://localhost:8080/login`, entering credentials, and verifying redirection to `/checker`.

### 2. GitHub Actions (Pipeline)
Configuration is managed via files in `.github/workflows/`:
* **CI (ci1.yml):** Runs automatically on every `push` or `pull_request` to `main/develop`. Installs dependencies, runs pytest and Playwright to prevent bugs.
* **CD (cd.yml):** Runs exclusively on push to main. Validates the code, builds the final production version (`npm run build`), and generates an artifact (`application-release`) containing everything needed for deployment.

### 3.Local Execution
Before `pushing`, make sure tests pass locally:
```
# Backend
pytest backend/tests

# Frontend E2E
npx playwright test tests/login.spec.ts
```

