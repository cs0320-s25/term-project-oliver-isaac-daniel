import { useState } from "react";
import "../../styles/main.css";

interface BlurbInputProps {
  onSubmit: (blurb: string) => void;
  error?: string | null; // Message from parent if input is invalid
}

export function BlurbInput({ onSubmit, error }: BlurbInputProps) {
  const [inputValue, setInputValue] = useState("");

  // Always notify the parent on submit (even if empty)
  const handleSubmit = () => {
    onSubmit(inputValue); // Let parent decide if it's valid
  };

  return (
    <div className="input-container" aria-live="polite">
      {/* Where the user describes what they're looking for */}
      <textarea
        className="input-textarea"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Describe the vibe, topics, or structure you're looking for..."
        aria-label="Course description input"
        rows={4}
      />
      
      {/* Triggers course search */}
      <button 
        className="submit-button" 
        onClick={handleSubmit} 
        aria-label="Submit course blurb"
      >
        Find Courses
      </button>

      {/* Error text, if any */}
      {error && (
        <p className="text-red-600 text-sm mt-2" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
