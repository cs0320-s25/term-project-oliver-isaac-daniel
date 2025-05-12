// Import the useState hook from React to manage local state
import { useState } from "react";

// Import styles from a CSS file
import "../../styles/main.css";

// Define the expected props for this component using TypeScript
// The component expects an `onSubmit` function that takes a string and returns void
interface BlurbInputProps {
  onSubmit: (blurb: string) => void;
}

// Define the functional React component `BlurbInput` and destructure the `onSubmit` prop
export function BlurbInput({ onSubmit }: BlurbInputProps) {
  // Declare a piece of state called `inputValue` to track the user's input
  // Initially, it's set to an empty string
  const [inputValue, setInputValue] = useState("");

  // Define a handler function to process the form submission
  const handleSubmit = () => {
    // Only proceed if the input is not empty after trimming whitespace
    if (inputValue.trim() !== "") {
      // Call the onSubmit function passed in via props with the cleaned input
      onSubmit(inputValue.trim());
      // Reset the input field to an empty string
      setInputValue("");
    }
  };

  // Render the component's UI
  return (
    <div className="input-container" aria-live="polite">
      {/* 
        Render a textarea input field
        - Binds its value to `inputValue`
        - Updates the state on every keystroke via `onChange`
        - Includes ARIA label for accessibility
        - Uses placeholder text to guide the user
      */}
      <textarea
        className="input-textarea"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Describe the vibe, topics, or structure you're looking for..."
        aria-label="Course description input"
        rows={4}
      />
      
      {/* 
        Render a button that submits the input
        - When clicked, runs the `handleSubmit` function
        - ARIA label helps screen readers describe its purpose
      */}
      <button 
        className="submit-button" 
        onClick={handleSubmit} 
        aria-label="Submit course blurb"
      >
        Find Courses
      </button>
    </div>
  );
}
