import { useState } from "react";
import "@/styles/App.css";
import { LoginButton } from "../LoginButton";
import { CourseSearchPage } from "./CourseSearchPage";

/**
 * This is the highest level of the Course Recommendation Application
 */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <div className="App">
      <div className="App-header">
        <h1 aria-label="Course Recommendation Application">Brown Course Finder</h1>
        <LoginButton isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </div>
      {isLoggedIn ? (
        <CourseSearchPage />
      ) : (
        <div id="modal-root" aria-label="Please log in to continue">
          Please log in to continue
        </div>
      )}
    </div>
  );
}

export default App;