# scoring_test.py
from scoring import score_combined

def test_score_courses():
    # Sample inputs
    user_blurb = "I love programming and data science."
    course_list = [
        "Learn Python programming from scratch.",
        "Master data science with hands-on projects.",
        "Introduction to cooking and baking.",
        "Advanced machine learning techniques.",
    ]
    
    # Call the function
    scores = score_combined(user_blurb, course_list, alpha = 0)
    
    # Assertions
    assert isinstance(scores, list), "Output should be a list."
    assert all(isinstance(score, float) for score in scores), "All scores should be floats."
    assert all(0 <= score <= 1 for score in scores), "Scores should be in the range [0, 1]."
    
    # Print scores for manual inspection
    print("Scores:", scores)

# Run the test
if __name__ == "__main__":
    test_score_courses()