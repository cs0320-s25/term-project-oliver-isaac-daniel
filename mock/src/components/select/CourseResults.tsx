import "../../styles/main.css";
import { Course } from "./CourseSearchPage";

interface CourseResultsProps {
  courses: Course[];
}

export function CourseResults({ courses }: CourseResultsProps) {
  return (
    <div className="results-container" aria-label="recommended courses">
      {courses.length === 0 ? (
        <div className="empty-message">No course recommendations yet. Try describing your ideal course!</div>
      ) : (
        courses.map((course, index) => (
          <div key={index} className="course-card" aria-label={`Recommended course ${index + 1}`}>
            <h2 className="course-title">{course.title}</h2>
            <h3 className="course-department">{course.department}</h3>
            <p className="course-description">{course.description}</p>
          </div>
        ))
      )}
    </div>
  );
}