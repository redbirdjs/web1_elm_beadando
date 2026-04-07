import { useState } from 'react'

import './App2.css'
import DisplayComponent from './App2/Display'
import AnswerButton from './App2/AnswerButton'

export default function App2() {
    const [points, setPoints] = useState(0);
    const [timer, setTimer] = useState(60);

    return (
    <div className={'trackguessr'}>
        <div className={'header'}>
            <h2>Points: {points}</h2>
            <h2>Timer: {timer}</h2>
        </div>
        <DisplayComponent src={'asd.png'} />
        <div className={'answers'}>
            <AnswerButton value={'Answer 1'} />
            <AnswerButton value={'Answer 1'} />
            <AnswerButton value={'Answer 1'} />
            <AnswerButton value={'Answer 1'} />
        </div>
    </div>
  )
}