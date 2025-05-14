# Course Recommendation System

The **Course Recommendation System** is a full-stack application that recommends courses to users based on their interests, preferences, and department priorities. It includes a backend server for processing and scoring course data, a frontend interface for user input and result display, and a data scraper to collect course information from CAB.

---

## Project Details

- **Project Name**: Course Recommendation System
- **Team Members**:
  - Oliver Tu (ostu) — Backend + scoring algorithm developer, integration
  - Isaac Fernandez-Lopez (iferna17) - Data Scraper
  - Daniel Omondi (domondi1) - Frontend Developer, integration
- **Estimated Time to Complete**: ~40 hours
- **GitHub Repository**: [https://github.com/cs0320-s25/term-project-oliver-isaac-daniel](https://github.com/cs0320-s25/term-project-oliver-isaac-daniel)

---

## Collaborators

- Worked individually
- Used:
  - ChatGPT (OpenAI, GPT-4, May 14 version) for help with writing test cases and debugging
  - StackOverflow for solving common FastAPI and ReactJS configuration issues

**ChatGPT Usage**:

> OpenAI. "ChatGPT." *https://chat.openai.com*. Accessed May 2025.  
> Used to help debug CORS header issues in test cases and refactor error-handling logic in the backend.

---

## Design Choices

### High-Level Architecture

- **Backend**:
  - Implements semantic and TF-IDF scoring
  - Provides endpoints for receiving user input and returning ranked course lists
- **Frontend**:
  - Sends user prompts to backend
  - Displays ranked results in a responsive interface
- **Scraper**:
  - A standalone module for collecting course descriptions and metadata from Brown's CAB system

### Class/Component Structure

#### Frontend

- `App.tsx`: Main application component
- `BlurbInput.tsx`: Handles input of the search query/blurb
- `CourseSearchPage.tsx`: Handles requests to Server and contains BlurbInput and CourseResults as components
- `CourseResults.tsx`: Displays results after response has been recieved from Server

#### Backend

- `main.py`: Backend entrypoint with endpoints and error-handling logic
- `scoring.py`: Contains modular functions for TF-IDF scoring, semantic matching, and department prioritization
- `data.py`: Contains method allowing access to data extraced by Scraper
- `test_main.py`: Contains integration testing for correct + edge case functionality on the server
- `test_scoring.py`: Contains unit tests for the scoring algorithm, ensuring expected behavior

#### Scraper

- `scraper.py`: Uses BeautifulSoup and `requests` to extract and format course data
- `selectors.py`: Extracts data from individual course page

---

## Known Errors and Bugs

No known errors or bugs.

---

## Testing

#### Frontend

- Application Navigation
- Course Search Input
- Course Description Submission
- New Search Functionality

#### Backend

- Scoring correctness (unit tests for each scoring method)
- API input validation
- Edge case inputs (empty query, invalid department, overly long input)
- CORS compliance

To run the frontend tests:

Navigate to the mock directory

```
npx playwright install
npx playwright test
```

To run the server tests:

Navigate to the server directory

```
./runtest
```

## Setup Instructions

### Frontend

Run the following commands in the mock directory to start the webpage:

```
npm install
npm start
```

### Server

#### Set up the Environment

Run the following commands in the base project directory:

```
chmod +x setup.sh
./setup.sh
```

This downloads the necessary libraries and creates the virtual environment for the backend.

Now you're all set - navigate to the server directory and start the backend:

```
./run
```
