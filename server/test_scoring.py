import pytest
from scoring import score_tfidf, score_semantic, score_combined

# Sample inputs
user_blurb = "I'm interested in African American literature, social justice, and the intersection of race and education."
all_courses = [
    {
        "id": "AFRI 0370",
        "department": "AFRI",
        "title": "African American Novels of the 1970s",
        "description": "Literary historians generally agree that in the 1970s, in the U.S., there was a significant increase in the publication of diverse forms of African American literature. ..."
    },
    {
        "id": "AFRI 0510",
        "department": "AFRI",
        "title": "Love Stories in African Literature and Film",
        "description": "In African cinema and modern African literature, the genre of the love story is often used by artists as a medium for addressing various socio-political issues. ..."
    },
    {
        "id": "AFRI 0807",
        "department": "AFRI",
        "title": "Racism, Segregation, Poverty and Public Education in the United States",
        "description": "Using film, podcasts, legal history, memoir, sociology and social history, this course focuses on the past and present state of education in the United States ..."
    },
    {
        "id": "AFRI 0840",
        "department": "AFRI",
        "title": "Monuments, History, and Memory in the United States",
        "description": "In the wake of the killing of George Floyd, monuments tied to the violent histories of slavery, colonialism, and white supremacy have received renewed interest ..."
    },
    {
        "id": "AFRI 0990",
        "department": "AFRI",
        "title": "Black Lavender: Black Gay/Lesbian Plays/Dramatic Constructions in the American Theatre",
        "description": "Study of plays with African-American LGBTQ+ content, primarily manuscripts, with a focus on thesis paper development. ..."
    }
]
course_list = [course["description"] for course in all_courses]
pref_departments = ["AFRI"]


def test_score_tfidf_returns_list_of_floats():
    scores = score_tfidf(user_blurb, course_list)
    assert isinstance(scores, list)
    assert len(scores) == len(course_list)
    for s in scores:
        assert isinstance(s, float)
        assert s >= 0


def test_score_semantic_returns_list_of_floats():
    scores = score_semantic(user_blurb, course_list)
    assert isinstance(scores, list)
    assert len(scores) == len(course_list)
    for s in scores:
        assert isinstance(s, float)
        assert s >= 0


def test_score_combined_returns_list_of_floats():
    scores = score_combined(user_blurb, all_courses, pref_departments)
    assert isinstance(scores, list)
    assert len(scores) == len(all_courses)
    for s in scores:
        assert isinstance(s, float)
        assert s >= 0


def test_score_combined_with_alpha_returns_list_of_floats():
    scores = score_combined(user_blurb, all_courses, pref_departments, alpha=0.7)
    assert isinstance(scores, list)
    assert len(scores) == len(all_courses)
    for s in scores:
        assert isinstance(s, float)
        assert s >= 0


def test_combined_between_tfidf_and_semantic():
    tfidf_scores = score_tfidf(user_blurb, course_list)
    semantic_scores = score_semantic(user_blurb, course_list)
    combined_scores = score_combined(user_blurb, all_courses, pref_departments)
    for t, m, c in zip(tfidf_scores, semantic_scores, combined_scores):
        lower, upper = min(t, m), max(t, m)
        assert lower <= c <= upper
