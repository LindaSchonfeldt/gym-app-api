import express, { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import cors from 'cors'
import dotenv from 'dotenv'
import { Exercise } from './types/models.js'
import mongoose from 'mongoose'

dotenv.config()

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 8080

app.use(cors())
app.use(express.json())

app.get('/', (_req: Request, res: Response) => {
  res.send('Gym App API is running!')
})

app.get('/exercises/bodyPart/:bodyPart', (async (
  req: Request,
  res: Response
) => {
  if (!process.env.RAPIDAPI_KEY) {
    return res.status(500).json({ error: 'RAPIDAPI_KEY not configured' })
  }
  const bodyPart = req.params.bodyPart

  try {
    const response = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host':
            process.env.RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com'
        }
      }
    )

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Status ${response.status}: ${body}`)
    }

    const exercises = (await response.json()) as Array<
      Exercise & Record<string, unknown>
    >
    res.json(exercises)
  } catch (err: any) {
    console.error(err)
    res
      .status(500)
      .json({ error: 'Failed to fetch exercises', details: err.message })
  }
}) as RequestHandler)

app.get('/exercises/:id', (async (req: Request, res: Response) => {
  const exerciseId = req.params.id

  if (!process.env.RAPIDAPI_KEY) {
    return res.status(500).json({ error: 'RAPIDAPI_KEY not configured' })
  }
  try {
    // Add '/exercise/' before the ID
    const response = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/exercise/${exerciseId}`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host':
            process.env.RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com'
        }
      }
    )

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Status ${response.status}: ${body}`)
    }

    const exercise = (await response.json()) as Exercise
    res.json(exercise)
  } catch (err: any) {
    console.error(err)
    res
      .status(500)
      .json({ error: 'Failed to fetch exercise', details: err.message })
  }
}) as RequestHandler)

app.get('/exercises', (async (_req: Request, res: Response) => {
  if (!process.env.RAPIDAPI_KEY) {
    return res.status(500).json({ error: 'RAPIDAPI_KEY not configured' })
  }

  try {
    const response = await fetch(
      'https://exercisedb.p.rapidapi.com/exercises?limit=10',
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host':
            process.env.RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com'
        }
      }
    )

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Status ${response.status}: ${body}`)
    }

    const exercises = (await response.json()) as Array<
      Exercise & Record<string, unknown>
    >
    res.json(exercises)
  } catch (err: any) {
    console.error(err)
    res
      .status(500)
      .json({ error: 'Failed to fetch exercises', details: err.message })
  }
}) as RequestHandler)

// Add MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
