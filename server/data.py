import json
import os

def get_all_courses():
    base_dir = os.path.dirname(os.path.dirname(__file__))  # Go up one level from /app/
    data_dir = os.path.join(base_dir, "data")
    file_path = os.path.join(data_dir, "courses.json")

    with open(file_path, 'r') as f:
        courses = json.load(f)
    
    return courses
