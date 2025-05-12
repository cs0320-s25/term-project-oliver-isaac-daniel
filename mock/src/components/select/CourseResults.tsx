// Import shared CSS styles
import "../../styles/main.css";

// Import the Course type to ensure proper typing for the props
import { Course } from "./CourseSearchPage";

// Define the expected props for this component using TypeScript
interface CourseResultsProps {
  courses: Course[];
}

// Define and export the CourseResults component
export function CourseResults({ courses }: CourseResultsProps) {
  return (
    // Container for the list of recommended courses
    <div className="results-container" aria-label="recommended courses">

      {/* If there are no courses, render nothing (handled by the parent component) */}
      {courses.length === 0 ? null : (

        // Map over each course and display its details in a styled card
        courses.map((course, index) => (
          <div
            key={index} // React key for efficient list rendering
            className="course-card" // CSS class for styling each card
            aria-label={`Recommended course ${index + 1}`} // For screen readers
          >
            {/* Course title */}
            <h2 className="course-title">{course.title}</h2>

            {/* Course ID — e.g., "CLPS 0010" */}
            <h4 className="course-id text-sm text-gray-500">{course.id}</h4>

            {/* Course department, extracted from ID */}
            <h3 className="course-department">{course.department}</h3>

            {/* Course description, or fallback if missing */}
            <p className="course-description">
              {course.description || "No description available."}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
