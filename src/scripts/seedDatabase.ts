import dotenv from 'dotenv'
import mongoose from 'mongoose'
import ExerciseModel from '../models/Exercise.js'
import { ExerciseData as ExerciseType } from '../types/models.js'

dotenv.config({ path: '.env' })

console.log('API Key exists:', !!process.env.RAPIDAPI_KEY)
console.log('MongoDB URI:', process.env.MONGODB_URI?.substring(0, 50) + '...')

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-app'
    )
    console.log('Connected to MongoDB')
    console.log('Database name:', mongoose.connection.name) // Use .name instead of .db.databaseName

    // Check if database already has data
    const count = await ExerciseModel.countDocuments()
    if (count > 0) {
      console.log(`Database already contains ${count} exercises`)
      console.log('Skipping seed operation')
      process.exit(0)
    }

    // Fetch data from ExerciseDB API
    console.log('Fetching exercises from API...')
    const response = await fetch(
      'https://exercisedb.p.rapidapi.com/exercises?limit=10', // Add limit
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
          'X-RapidAPI-Host':
            process.env.RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`)
    }

    const exercises = (await response.json()) as ExerciseType[]
    console.log(`Fetched ${exercises.length} exercises`)

    // Insert exercises into MongoDB
    console.log('Inserting exercises into database...')
    await ExerciseModel.insertMany(exercises)

    console.log('Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
