// Import
import { useState } from "react";

// Import shared CSS styles
import "../../styles/main.css";

// Import child components and mock data
import { BlurbInput } from "./BlurbInput";
import { CourseResults } from "./CourseResults";
import { mockCourses } from "../../mocks/mockedData";

// Defines the structure of each course object
export interface Course {
  title: string;
  department: string;
  description: string; // Description is now expected from backend
  id: string; // Course Nu
}

// Toggle between mock data and real ML backend
const useMockData = false;

// Main component that handles user interaction, data fetching, and rendering
export function CourseSearchPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedBlurb, setSubmittedBlurb] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null); // To show user-facing input errors

  // Called when the user submits the input blurb
  const handleBlurbSubmit = async (blurb: string) => {
    if (blurb.trim() === "") {
      setInputError("Please enter a course description before searching.");
      return;
    }

    setInputError(null); // Clear error if input is valid
    setSubmittedBlurb(blurb);
    setError(null);
    setCourses([]);
    setLoading(true);

    try {
      if (useMockData) {
        // Use fallback mock data
        await new Promise((res) => setTimeout(res, 1000));
        setCourses(mockCourses);
      } else {
        // Talk to the actual backend
        const response = await fetch("http://127.0.0.1:8000/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_blurb: blurb, // User's input
            pref_departments: [], // Currently unused, could filter by department
            num_courses: 10, // Number of courses to return
            alpha: 0.5, // Hyperparameter (e.g., weighting for filtering)
          }),
        });

        if (!response.ok) throw new Error("Server error");

        // Parse response and map results to course format
        const result = await response.json();
        const parsedCourses = result.results.map((entry: any) => ({
          id: entry.id,
          title: entry.course,
          department: entry.id.split(" ")[0], // Fallback for department name
          description: entry.description || "No description provided", // Fallback if description is missing
        }));

        // Update state with fetched results
        setCourses(parsedCourses);
      }
    } catch (err) {
      console.error("Error fetching results:", err);
      setError("Server error. Showing fallback mock data.");
      setCourses(mockCourses); // Still show something if backend fails
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Allows the user to reset the form and try again
  const handleNewSearch = () => {
    setSubmittedBlurb("");
    setCourses([]);
    setError(null);
    setLoading(false);
    setInputError(null);
  };

  // JSX to render the UI
  return (
    <div className="min-h-[95vh] relative">
      <div className="w-full">
        {/* Container for the input form */}
        <div
          className="search-container"
          aria-label="Course recommendation container"
        >
          {/* Input area shows only if user hasn’t submitted a blurb yet */}
          {!submittedBlurb && (
            <BlurbInput onSubmit={handleBlurbSubmit} error={inputError} />
          )}
        </div>

        {/* Show results message and "New Search" button */}
        {submittedBlurb && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <p className="results-message">
              <strong>These are your results for:</strong> "{submittedBlurb}"
            </p>
            <button
              onClick={handleNewSearch}
              className="border px-4 py-2 rounded hover:bg-gray-100"
              aria-label="Start a new course search"
            >
              New Search
            </button>
          </div>
        )}

        <hr />

        {/* While backend is loading */}
        {loading && (
          <div className="loading-message" aria-live="polite">
            Finding courses for you...
          </div>
        )}

        {/* If backend failed */}
        {error && (
          <div className="error-message" aria-live="assertive">
            {error}
          </div>
        )}

        {/* If no results came back */}
        {!loading && submittedBlurb && courses.length === 0 && (
          <div className="no-results-message">
            <p>
              <strong>No courses found for:</strong> "{submittedBlurb}"
            </p>
          </div>
        )}

        {/* Friendly nudge if they haven’t typed anything yet */}
        {!submittedBlurb && courses.length === 0 && !loading && (
          <div className="example-message" aria-label="Example blurb">
            <p>
              <em>
                Try typing something like: "I want a class on chill ECON Class"
              </em>
            </p>
          </div>
        )}

        {/* Show the course recommendations */}
        <CourseResults courses={courses} />

        {/* Optional help link to external CAB (Courses at Brown) website */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Not finding what you're looking for? You can also browse the{" "}
          <a
            href="https://cab.brown.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Courses at Brown (CAB) website
          </a>
          .
        </div>
      </div>
    </div>
  );
}
