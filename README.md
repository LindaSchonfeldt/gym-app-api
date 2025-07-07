# Gym App API Backend

This Express-based API provides workout and exercise data for the Gym App frontend. It connects to the ExerciseDB API to retrieve comprehensive exercise information.

## Features

- RESTful API endpoints for accessing exercise data
- TypeScript implementation for type safety
- Integration with ExerciseDB via RapidAPI
- Environment-based configuration

## Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn
- RapidAPI account and API key for ExerciseDB

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with:
   ```
   PORT=8080
   NODE_ENV=development
   RAPIDAPI_KEY=your_rapidapi_key_here
   RAPIDAPI_HOST=exercisedb.p.rapidapi.com
   ```

3. Run the development server:
   ```bash
   # For JavaScript version
   npm run dev
   
   # For TypeScript version
   npm run dev:ts
   ```

4. The server will be available at http://localhost:8080

## API Endpoints

### GET /
Returns a status message indicating the API is running.

### GET /exercises
Returns a paginated list of exercises.

### GET /exercises/:id
Returns details about a specific exercise by ID.

## TypeScript Development

The API is built with TypeScript for enhanced type safety and developer experience.

To compile TypeScript code:
```bash
npm run build
```

To run the compiled JavaScript:
```bash
node dist/server.js
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | The port the server will run on |
| NODE_ENV | Development or production environment |
| RAPIDAPI_KEY | Your RapidAPI key for ExerciseDB |
| RAPIDAPI_HOST | RapidAPI host (exercisedb.p.rapidapi.com) |


