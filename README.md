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

- `main.py`: Backend entrypoint with endpoints and error-handling logic
- `scoring.py`: Contains modular functions for TF-IDF scoring, semantic matching, and department prioritization
- `scraper.py`: Uses BeautifulSoup and `requests` to extract and format course data
- `frontend/`: React app with controlled input forms and card-style displays for results

### Data Structures

- Uses dictionaries for in-memory course storage and JSON files for static storage
- NumPy arrays and vectorized operations for efficient semantic comparisons

### Optimizations

- Semantic similarity uses SentenceTransformer embeddings preloaded on startup
- All scoring operations are batched and vectorized to reduce latency

---

## Known Errors and Bugs

No known errors or bugs.

---

## Checkstyle

- No outstanding style violations. Used `black` for formatting and followed PEP8 guidelines.
- ESLint clean on frontend codebase.

---

## Testing

Tests cover:

- Scoring correctness (unit tests for each scoring method)
- API input validation
- Edge case inputs (empty query, invalid department, overly long input)
- CORS compliance

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
