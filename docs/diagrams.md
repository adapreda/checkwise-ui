# CheckWise - Diagrame de proiect

## 1. Diagrama cazurilor de utilizare

Scop: arata functionalitatile principale ale sistemului din perspectiva utilizatorului.

```mermaid
flowchart LR
    User([Utilizator])

    subgraph System["CheckWise"]
        Auth([Autentificare / inregistrare])
        SubmitText([Verifica text introdus manual])
        SubmitUrl([Verifica URL])
        ExtractUrl([Extrage continutul paginii])
        RunAgents([Ruleaza analiza multi-agent])
        ViewResult([Vizualizeaza verdictul final])
        OpenAgentDetails([Consulta detalii pe fiecare agent])
        ViewHistory([Consulta istoricul verificarilor])
        ManageSettings([Gestioneaza setari cont])

        RunStatistical([Analiza statistica si stilistica])
        RunGrammar([Analiza gramaticala])
        RunFactCheck([Verificare factuala])
        RunMaster([Agregare prin Master Agent])
    end

    ExternalPage([Pagina web externa])
    Tavily([Tavily Search])
    Gemini([Gemini API])
    LocalLLM([Modele locale Ollama])

    User --> Auth
    User --> SubmitText
    User --> SubmitUrl
    User --> ViewResult
    User --> OpenAgentDetails
    User --> ViewHistory
    User --> ManageSettings

    SubmitUrl -. include .-> ExtractUrl
    SubmitText -. include .-> RunAgents
    SubmitUrl -. include .-> RunAgents
    RunAgents -. include .-> RunStatistical
    RunAgents -. include .-> RunGrammar
    RunAgents -. include .-> RunFactCheck
    RunAgents -. include .-> RunMaster
    RunAgents --> ViewResult

    ExtractUrl --> ExternalPage
    RunFactCheck --> Tavily
    RunFactCheck --> Gemini
    RunStatistical --> LocalLLM
    RunGrammar --> LocalLLM
    RunMaster --> LocalLLM
```

## 2. Diagrama arhitecturii componentelor

Scop: arata impartirea sistemului in frontend, backend, agenti AI, servicii externe si persistenta.

```mermaid
flowchart TB
    subgraph Frontend["Frontend React + Vite"]
        Browser["Browser utilizator"]
        Routes["React Router: Landing, Login/Register, Checker, Dashboard, Settings"]
        Checker["CheckerPage: text / URL input, agent cards, rezultate"]
        Dashboard["DashboardPage: istoric verificari"]
        ApiClient["API client: verifyText, fetchHistory"]
        LocalAuth["localStorage: user email"]
    end

    subgraph Backend["Backend FastAPI"]
        Api["REST API: /api/text/verify, /api/history, /api/fact-check, /api/health"]
        UrlExtractor["URL extraction: trafilatura"]
        Service["build_text_verification_result"]
        HistoryRepo["Repository SQLite: insert / fetch history"]
    end

    subgraph Agents["Agenti AI si analiza"]
        Statistical["Statistic Agent: semnale lingvistice, fraze, repetitii, scor AI"]
        Grammatical["Grammatical Agent: gramatica, punctuatie, consistenta"]
        FactChecking["Fact-Checking Agent: extrage claims, cauta dovezi, evalueaza surse"]
        Master["Master Agent: combina scorurile agentilor"]
    end

    subgraph External["Dependinte externe / locale"]
        Ollama["Ollama: llama3.2 / llama3.2:1b"]
        Gemini["Gemini API optional"]
        Tavily["Tavily Search optional"]
        Web["Pagini web analizate"]
    end

    DB[(SQLite: backend/checkwise.db)]

    Browser --> Routes
    Routes --> Checker
    Routes --> Dashboard
    Routes --> LocalAuth
    Checker --> ApiClient
    Dashboard --> ApiClient
    ApiClient --> Api

    Api --> UrlExtractor
    UrlExtractor --> Web
    Api --> Service
    Service --> Statistical
    Service --> Grammatical
    Service --> FactChecking
    Service --> Master
    Service --> HistoryRepo
    HistoryRepo --> DB
    Api --> HistoryRepo

    Statistical --> Ollama
    Grammatical --> Ollama
    Master --> Ollama
    FactChecking --> Gemini
    FactChecking --> Tavily
```

## 3. Diagrama de clase / model de domeniu

Scop: evidentiaza structura statica a datelor importante schimbate intre frontend, backend, agenti si baza de date.

```mermaid
classDiagram
    class TextVerificationRequest {
        user_email
        text
        input_type
    }

    class TextVerificationResponse {
        title
        verification_title
        language
        verdict
        percentage
        final_label
        summary
        limitations
    }

    class DocumentAssessment {
        ai_likelihood_score
        ai_likelihood_label
        confidence
    }

    class SignalBreakdown {
        semantic_model_score
        stylometric_score
        robustness_score
    }

    class TextAnalysisMetrics {
        sentence_count
        sentence_lengths
        length_variation_score
        repeated_linking_words
        expressive_repetition_score
        linguistic_style_score
    }

    class GrammaticalResult {
        score
        confidence
        reasons_for_rating
        lowered_confidence_reasons
    }

    class FactCheckingResult {
        overall_trust_score
        overall_confidence_score
        total_claims
    }

    class FactCheckedClaim {
        claim
        type
        queries
        verdict
        claim_score
        confidence_score
        explanation
    }

    class SourceEvidence {
        title
        url
        credibility_score
        snippet
    }

    class MasterResult {
        score
        raw_score
        label
        available
        used_agents
        missing_agents
        formula
    }

    class HistoryEntry {
        id
        user_email
        input_type
        submitted_text
        text_preview
        verification_rating
        statistical_percentage
        confidence
        structured_result
        created_at
    }

    TextVerificationRequest --> TextVerificationResponse : produce
    TextVerificationResponse *-- DocumentAssessment
    TextVerificationResponse *-- SignalBreakdown
    TextVerificationResponse *-- TextAnalysisMetrics
    TextVerificationResponse *-- GrammaticalResult
    TextVerificationResponse *-- FactCheckingResult
    TextVerificationResponse *-- MasterResult
    FactCheckingResult *-- FactCheckedClaim
    FactCheckedClaim *-- SourceEvidence
    HistoryEntry *-- TextVerificationResponse : structured_result
```

## 4. Diagrama de stare: ciclul unei verificari

Scop: descrie starile prin care trece o verificare pana cand utilizatorul primeste rezultatul.

```mermaid
stateDiagram-v2
    state "&nbsp;&nbsp;&nbsp;Idle&nbsp;&nbsp;&nbsp;" as Idle
    state "&nbsp;&nbsp;&nbsp;Editing input&nbsp;&nbsp;&nbsp;" as EditingInput
    state "&nbsp;&nbsp;&nbsp;Validating input&nbsp;&nbsp;&nbsp;" as ValidatingInput
    state "&nbsp;&nbsp;&nbsp;Validation error&nbsp;&nbsp;&nbsp;" as ValidationError
    state "&nbsp;&nbsp;&nbsp;Extracting URL&nbsp;&nbsp;&nbsp;" as ExtractingUrl
    state "&nbsp;&nbsp;&nbsp;Extraction error&nbsp;&nbsp;&nbsp;" as ExtractionError
    state "&nbsp;&nbsp;&nbsp;Running agents&nbsp;&nbsp;&nbsp;" as RunningAgents
    state "&nbsp;&nbsp;&nbsp;Partial agent fallback&nbsp;&nbsp;&nbsp;" as PartialAgentFallback
    state "&nbsp;&nbsp;&nbsp;Aggregating result&nbsp;&nbsp;&nbsp;" as AggregatingResult
    state "&nbsp;&nbsp;&nbsp;Saving history&nbsp;&nbsp;&nbsp;" as SavingHistory
    state "&nbsp;&nbsp;&nbsp;Displaying result&nbsp;&nbsp;&nbsp;" as DisplayingResult
    state "&nbsp;&nbsp;&nbsp;Viewing agent details&nbsp;&nbsp;&nbsp;" as ViewingAgentDetails

    [*] --> Idle
    Idle --> EditingInput: utilizator introduce text / URL
    EditingInput --> ValidatingInput: apasa Verify

    ValidatingInput --> ValidationError: text lipsa / prea scurt / user neautentificat
    ValidationError --> EditingInput: corecteaza inputul

    ValidatingInput --> ExtractingUrl: input URL
    ValidatingInput --> RunningAgents: input text
    ExtractingUrl --> ExtractionError: pagina nu poate fi descarcata sau parsata
    ExtractionError --> EditingInput: utilizator incearca alt URL
    ExtractingUrl --> RunningAgents: text extras cu succes

    RunningAgents --> PartialAgentFallback: un agent esueaza
    PartialAgentFallback --> AggregatingResult: se foloseste fallback / scor neutru
    RunningAgents --> AggregatingResult: toti agentii returneaza rezultate

    AggregatingResult --> SavingHistory: Master Agent calculeaza verdictul agregat
    SavingHistory --> DisplayingResult: istoricul este salvat
    DisplayingResult --> ViewingAgentDetails: utilizator deschide cardul unui agent
    ViewingAgentDetails --> DisplayingResult: inchide detaliile
    DisplayingResult --> Idle: incepe o verificare noua
```

## 5. Workflow logic al agentilor

Scop: arata cum contribuie fiecare agent la verdictul final.

```mermaid
flowchart LR
    Input["Text analizat"]

    subgraph StatisticFlow["Statistic Agent"]
        Normalize["Normalizeaza textul"]
        Linguistic["Evalueaza wording si coerenta"]
        Stylometric["Calculeaza lungimi, repetitii, linking words"]
        StatScore["Produce scor AI statistic"]
    end

    subgraph GrammarFlow["Grammatical Agent"]
        GrammarPrompt["Trimite prompt catre model local"]
        GrammarParse["Parseaza raspunsul JSON"]
        GrammarScore["Produce scor gramatical"]
    end

    subgraph FactFlow["Fact-Checking Agent"]
        Claims["Extrage afirmatii factuale"]
        Queries["Genereaza interogari"]
        Sources["Cauta surse si calculeaza credibilitatea"]
        ClaimVerdict["Evalueaza verdict per afirmatie"]
        FactScore["Produce factual trust score"]
    end

    subgraph MasterFlow["Master Agent"]
        Collect["Colecteaza scoruri disponibile"]
        Convert["Converteste factual trust in AI suspicion"]
        Average["Calculeaza media scorurilor"]
        Final["Returneaza verdict final"]
    end

    Input --> Normalize
    Normalize --> Linguistic
    Normalize --> Stylometric
    Linguistic --> StatScore
    Stylometric --> StatScore

    Input --> GrammarPrompt
    GrammarPrompt --> GrammarParse
    GrammarParse --> GrammarScore

    Input --> Claims
    Claims --> Queries
    Queries --> Sources
    Sources --> ClaimVerdict
    ClaimVerdict --> FactScore

    StatScore --> Collect
    GrammarScore --> Collect
    FactScore --> Convert
    Convert --> Collect
    Collect --> Average
    Average --> Final
```
