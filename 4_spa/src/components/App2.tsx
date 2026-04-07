import { useState } from 'react'

import './App2.css'
import DisplayComponent from './App2/Display'
import AnswerButton from './App2/AnswerButton'

import Tracks from './App2/tracks.json'

export default function App2() {
    const [points, setPoints] = useState(0);
    const [timer, setTimer] = useState(60);
    const trackNames = Object.keys(Tracks);

    const getRandomTrack = () => {
        const idx = Math.floor(Math.random() * trackNames.length);
        const name = trackNames[idx];
        const layout: string = (Tracks as {[k: string]: string})[name];

        return { name, layout };
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