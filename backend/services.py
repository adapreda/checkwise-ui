from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from checkwise_stats.text_analysis import run_detection_pipeline

from .db import insert_history_entry


def build_text_verification_result(user_email: str, text: str) -> dict[str, Any]:
    structured_result = run_detection_pipeline(text)
    document_assessment = structured_result["document_assessment"]
    displayed_percentage = structured_result.get("percentage")
    if isinstance(displayed_percentage, (int, float)):
        score_percentage = round(displayed_percentage)
    else:
        score_percentage = round(document_assessment["ai_likelihood_score"] * 100)
    explanation = structured_result.get("final_user_message") or " ".join(
        [
            *structured_result.get("why", []),
            *structured_result.get("what_weakens_the_conclusion", []),
        ]
    ).strip()
    if not explanation:
        explanation = "This result is a probabilistic estimate, not proof."

    record = {
        "user_email": user_email,
        "input_type": "text",
        "submitted_text": text,
        "text_preview": text.strip().replace("\n", " ")[:180],
        "verification_rating": score_percentage,
        "statistical_percentage": score_percentage,
        "confidence": document_assessment["confidence"],
        "explanation": explanation,
        "structured_result": structured_result,
        "created_at": datetime.now(UTC).isoformat(),
    }

    insert_history_entry(record)
    return structured_result
