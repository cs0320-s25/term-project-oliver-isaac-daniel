import { useState } from "react";
import "../../styles/main.css";
import { BlurbInput } from "./BlurbInput";
import { CourseResults } from "./CourseResults";
import { mockCourses } from "../../mocks/mockedData";

// Course type definition
export interface Course {
  title: string;
  department: string;
  description: string;
  id?: string;
}

// Toggle between mock mode and real ML backend
const useMockData = false;

export function CourseSearchPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedBlurb, setSubmittedBlurb] = useState<string>("");

  // Handles form submission when a blurb is entered
  const handleBlurbSubmit = async (blurb: string) => {
    setSubmittedBlurb(blurb);
    setError(null);
    setCourses([]); // Clear previous results while new request loads
    setLoading(true);

    try {
      if (useMockData) {
        // Use fallback mock data (simulate delay to mimic backend)
        await new Promise((res) => setTimeout(res, 1000));
        setCourses(mockCourses);
      } else {
        // 🔗 Real backend call — sends user blurb to FastAPI ML model
        const response = await fetch("http://127.0.0.1:8000/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_blurb: blurb,
            pref_departments: [],
            num_courses: 10,
            alpha: 0.5,
          }),
        });

        if (!response.ok) throw new Error("Server error");

        const result = await response.json();

        const parsedCourses = result.results.map((entry: any) => ({
          id: entry.id,
          title: entry.course,
          department: entry.id.split(" ")[0],
          description: entry.description || "No description provided",
        }));

        setCourses(parsedCourses);
      }
    } catch (err) {
      console.error("Error fetching results:", err);
      setError("Server error. Showing fallback mock data.");
      setCourses(mockCourses); // Fallback
    } finally {
      setLoading(false);
    }
  };

  // Resets the search session to allow a new blurb to be entered
  const handleNewSearch = () => {
    setSubmittedBlurb("");
    setCourses([]);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="min-h-[95vh] relative">
      <div className="w-full">
        <div className="search-container" aria-label="Course recommendation container">
          {/* Input box for the user to describe their course interest */}
          {!submittedBlurb && <BlurbInput onSubmit={handleBlurbSubmit} />}
        </div>

        {submittedBlurb && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <p className="results-message"><strong>These are your results for:</strong> "{submittedBlurb}"</p>
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

        {/* Loading state */}
        {loading && (
          <div className="loading-message" aria-live="polite">
            Finding courses for you...
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="error-message" aria-live="assertive">
            {error}
          </div>
        )}

        {/* Show message when no results are found */}
        {!loading && submittedBlurb && courses.length === 0 && (
          <div className="no-results-message">
            <p><strong>No courses found for:</strong> "{submittedBlurb}"</p>
          </div>
        )}

        {/* Example message when nothing is submitted yet */}
        {!submittedBlurb && courses.length === 0 && !loading && (
          <div className="example-message" aria-label="Example blurb">
            <p><em>Try typing something like: "I want a class on chill ECON Class"</em></p>
          </div>
        )}

        {/* Results list */}
        <CourseResults courses={courses} />

        {/* Helpful link to CAB for manual browsing */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Not finding what you're looking for? You can also browse the{" "}
          <a
            href="https://cab.brown.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Courses at Brown(CAB) website
          </a>.
        </div>
      </div>
    </div>
  );
}
