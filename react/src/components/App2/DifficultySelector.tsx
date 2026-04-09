export default function DifficultySelector({ difficulty, setDifficulty }: {
    difficulty: 'easy' | 'normal' | 'hard';
    setDifficulty: (difficulty: 'easy' | 'normal' | 'hard') => void;
}) {
    return (
        <div className={'difficulty-selector'}>
            <button className={(difficulty == 'easy') ? 'active' : ''} onClick={() => setDifficulty('easy')}>Easy</button>
            <button className={(difficulty == 'normal') ? 'active' : ''} onClick={() => setDifficulty('normal')}>Normal</button>
            <button className={(difficulty == 'hard') ? 'active' : ''} onClick={() => setDifficulty('hard')}>Hard</button>
        </div>
    )
}