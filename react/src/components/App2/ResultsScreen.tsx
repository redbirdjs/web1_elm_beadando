import { useState } from 'react'

import DifficultySelector from './DifficultySelector';

type Difficulty = 'easy' | 'normal' | 'hard';

export default function ResultsScreen({ points, defaultDifficulty, startGame }: { points: number, defaultDifficulty: Difficulty, startGame: (difficulty: Difficulty) => void }) {
    const [difficulty, setDifficulty] = useState<Difficulty>(defaultDifficulty || 'normal');

    return (
        <div className={'results-screen'}>
            <h1>Game results</h1>
            <p>Points: {points}</p>
            <p>Difficulty: {defaultDifficulty}</p>
            <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />
            <button onClick={() => startGame(difficulty)}>Play again</button>
        </div>
    )
}