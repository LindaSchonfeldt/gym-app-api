export interface Exercise {
  bodyPart: string
  equipment: string
  id: number
  name: string
  target: string
  secondaryMuscles: string[]
  instructions: string[]
  description: string
  difficulty: string
  category: string
  gifUrl: string
}

export interface ExerciseData {
  bodyPart: string
  equipment: string
  gifUrl: string
  id: string
  name: string
  target: string
  secondaryMuscles?: string[]
  instructions?: string[]
}
