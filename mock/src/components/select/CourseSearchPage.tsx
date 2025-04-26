import { useState } from "react";
import "../../styles/main.css";
import { BlurbInput } from "./BlurbInput";
import { CourseResults } from "./CourseResults";

export interface Course {
  title: string;
  department: string;
  description: string;
}

export function CourseSearchPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleBlurbSubmit = async (blurb: string) => {
    try {
      setLoading(true);
      const response = await fetch("/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blurb }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const result = await response.json();
      setCourses(result.courses);
      setError(null);
    } catch (err) {
      setError("Unable to fetch recommendations. Please try again.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[95vh] relative">
      <div className="w-full" style={{ width: "100%" }}>
        <div className="search-container" aria-label="Course recommendation container">
          <BlurbInput onSubmit={handleBlurbSubmit} />
        </div>
        <hr />
        {error && <div className="error-message" aria-live="assertive">{error}</div>}
        {loading && <div className="loading-message" aria-live="polite">Finding courses for you...</div>}
        <CourseResults courses={courses} />
      </div>
    </div>
  );
}