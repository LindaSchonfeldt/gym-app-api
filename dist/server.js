import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 8080;
app.use(cors());
app.use(express.json());
app.get('/', (_req, res) => {
    res.send('Gym App API is running!');
});
app.get('/exercises/bodyPart/:bodyPart', (async (req, res) => {
    if (!process.env.RAPIDAPI_KEY) {
        return res.status(500).json({ error: 'RAPIDAPI_KEY not configured' });
    }
    const bodyPart = req.params.bodyPart;
    try {
        const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`, {
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com'
            }
        });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Status ${response.status}: ${body}`);
        }
        const exercises = (await response.json());
        res.json(exercises);
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ error: 'Failed to fetch exercises', details: err.message });
    }
}));
app.get('/exercises/:id', (async (req, res) => {
    const exerciseId = req.params.id;
    if (!process.env.RAPIDAPI_KEY) {
        return res.status(500).json({ error: 'RAPIDAPI_KEY not configured' });
    }
    try {
        // Add '/exercise/' before the ID
        const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/exercise/${exerciseId}`, {
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com'
            }
        });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Status ${response.status}: ${body}`);
        }
        const exercise = (await response.json());
        res.json(exercise);
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ error: 'Failed to fetch exercise', details: err.message });
    }
}));
app.get('/exercises', (async (_req, res) => {
    if (!process.env.RAPIDAPI_KEY) {
        return res.status(500).json({ error: 'RAPIDAPI_KEY not configured' });
    }
    try {
        const response = await fetch('https://exercisedb.p.rapidapi.com/exercises?limit=10', {
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com'
            }
        });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Status ${response.status}: ${body}`);
        }
        const exercises = (await response.json());
        res.json(exercises);
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ error: 'Failed to fetch exercises', details: err.message });
    }
}));
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
