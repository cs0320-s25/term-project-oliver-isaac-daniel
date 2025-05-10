from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware
from pydantic import BaseModel
from typing import List
from scoring import score_combined
from data import get_all_courses

app = FastAPI()

#  Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001"],  # Allow your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Response object for a single course
class CourseScore(BaseModel):
    course: str
    id: str
    score: float

# Overall response
class ScoreResponse(BaseModel):
    results: List[CourseScore]

class ScoreRequest(BaseModel):
    user_blurb: str
    pref_departments: List[str] = []  # Optional list of preferred departments
    num_courses: int = 10  # Number of courses to return
    alpha: float = 0.25  # Weight between TF-IDF and semantic

@app.post("/score", response_model=ScoreResponse)
def score_endpoint(request: ScoreRequest):
    all_courses = get_all_courses()

    scores = score_combined(
        user_blurb=request.user_blurb,
        all_courses=all_courses,
        pref_departments=request.pref_departments,
        alpha=request.alpha
    )

    # Build list of scored course results
    course_score_pairs = [
        {"course": course["title"], "id": course["id"], "score": score, "department": course["department"]}
        for course, score in zip(all_courses, scores)
    ]

    course_score_pairs.sort(key=lambda x: x["score"], reverse=True)

    return ScoreResponse(results=course_score_pairs[:request.num_courses])
