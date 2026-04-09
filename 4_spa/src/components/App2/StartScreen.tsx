import { useState } from 'react'

import DifficultySelector from './DifficultySelector';

type Difficulty = 'easy' | 'normal' | 'hard';

export default function StartScreen({ startGame, defaultDifficulty }: { startGame: (difficulty: Difficulty) => void, defaultDifficulty?: Difficulty }) {
    const [difficulty, setDifficulty] = useState<Difficulty>(defaultDifficulty || 'normal');

    return (
        <div className={'start-screen'}>
            <h1>Track Guessr</h1>
            <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />
            <button onClick={() => startGame(difficulty)}>Start Game</button>
        </div>
    )
}