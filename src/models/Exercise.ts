import mongoose from 'mongoose'
import { ExerciseData } from '../types/models.js'

const exerciseSchema = new mongoose.Schema({
  bodyPart: String,
  equipment: String,
  id: String,
  name: String,
  target: String,
  secondaryMuscles: [String],
  instructions: [String],
  description: String,
  difficulty: String,
  category: String,
  gifUrl: String
})

// Use the ExerciseData interface to type the model
const ExerciseModel = mongoose.model<ExerciseData>('Exercise', exerciseSchema)
export default ExerciseModel
