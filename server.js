import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Gym App API is running!')
})

app.get('/exercises', async (req, res) => {
  // Get exercises from the Exercise API

  try {
    if (!process.env.RAPIDAPI_KEY) {
      return res.status(500).json({ error: 'RAPIDAPI_KEY not configured' })
    }

    const response = await fetch(
      'https://exercisedb.p.rapidapi.com/exercises?limit=10',
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host':
            process.env.RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com'
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error response body:', errorText)
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      )
    }

    const exercises = await response.json()
    res.json(exercises)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch exercises', details: error.message })
  }
})

app.get('/exercises/:id', async (req, res) => {
  // Get a specific exercise by ID
  try {
    if (!process.env.RAPIDAPI_KEY) {
      return res.status(500).json({ error: 'RAPIDAPI_KEY not configured' })
    }

    const exerciseId = req.params.id

    const response = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/exercise/${exerciseId}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host':
            process.env.RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com'
        }
      }
    )

    if (!response.ok) {
      // Handle 404 specially for better user experience
      if (response.status === 404) {
        return res
          .status(404)
          .json({ error: `Exercise with ID ${exerciseId} not found` })
      }

      const errorText = await response.text()
      console.log('Error response body:', errorText)
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      )
    }

    const exercise = await response.json()
    res.json(exercise)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch exercise', details: error.message })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
