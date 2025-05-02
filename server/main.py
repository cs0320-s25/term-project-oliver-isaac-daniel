from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from scoring import score_combined
from data import get_all_courses

app = FastAPI()

# New response object for a single course
class CourseScore(BaseModel):
    course: str
    score: float

# New overall response
class ScoreResponse(BaseModel):
    results: List[CourseScore]

class ScoreRequest(BaseModel):
    user_blurb: str
    pref_departments: List[str] = []  # Optional list of preferred departments
    num_courses: int = 10  # Number of courses to return
    alpha: float = 0.25 # Optional alpha value for scoring

@app.post("/score", response_model=ScoreResponse)
def score_endpoint(request: ScoreRequest):
    all_courses = get_all_courses()

    scores = score_combined(
        user_blurb=request.user_blurb,
        all_courses= all_courses,
        pref_departments=request.pref_departments,
        alpha=request.alpha
    )

    # Match descriptions back to course titles/IDs
    course_score_pairs = [
        {"course": course["title"], "score": score}
        for course, score in zip(all_courses, scores)
    ]

    course_score_pairs.sort(key=lambda x: x["score"], reverse=True)

    return ScoreResponse(results=course_score_pairs[:request.num_courses])
