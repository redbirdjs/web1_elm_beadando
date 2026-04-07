export default function AnswerButton({ value, clickHandler }: { value: string, clickHandler: (answer: string) => void }) {
    return (
        <button className={'answer'} onClick={() => clickHandler(value)}>{value}</button>
    )
}