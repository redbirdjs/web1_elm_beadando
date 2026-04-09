import { useState, useMemo, useEffect, useRef, useCallback } from 'react'

import './App2.css'
import DisplayComponent from './App2/Display'
import AnswerButton from './App2/AnswerButton'

import Tracks from './App2/tracks.json'
import StartScreen from './App2/StartScreen'
import ResultsScreen from './App2/ResultsScreen'

interface TrackList { [k: string]: string }
type Difficulty = 'easy' | 'normal' | 'hard';

export default function App2() {
    const [gameStarted, setGameStarted] = useState(false);
    const [isResults, setIsResults] = useState(true);
    const [points, setPoints] = useState(0);
    const [difficulty, setDifficulty] = useState<Difficulty>('normal');

    const timer = useRef<number | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(60);

    const trackNames = useMemo(() => Object.keys(Tracks), []);

    const startGame = (diff: 'easy' | 'normal' | 'hard') => {
        setDifficulty(diff);
        switch (diff) {
            case 'easy': setTimeRemaining(60); break;
            case 'normal': setTimeRemaining(30); break;
            case 'hard': setTimeRemaining(15); break;
        }
        setGameStarted(true);
        setIsResults(false);
        setPoints(0);
    }

    const generateAnswers = (answer: string) => {
        const answers = [answer];
        while (answers.length < 4) {
            const filtered = trackNames.filter(t => !answers.includes(t));
            const idx = Math.floor(Math.random() * filtered.length);

            answers.push(filtered[idx]);
        }
        answers.sort(() => Math.random() - 0.5);

        return answers;
    }

    const track = getRandomTrack();
    const answers = generateAnswers(track.name);

    const handleAnswer = (answer: string) => {
        if (answer === track.name) {
            setPoints(() => points + 10);
        } else {
            setPoints(() => points - 5);
        }
        setTimer(() => timer -1);
    }

    return (
    <div className={'trackguessr'}>
        <div className={'header'}>
            <h2>Points: {points}</h2>
            <h2>Timer: {timer}</h2>
        </div>
        <DisplayComponent src={'./img/' + track.layout} />
        <div className={'answers'}>
            { answers.map(a => <AnswerButton value={a} clickHandler={handleAnswer} />) }
        </div>
    </div>
  )
}