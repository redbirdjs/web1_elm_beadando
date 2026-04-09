export default function DisplayComponent({ src }: { src: string }) {
    return (
        <div className={'question-display'}>
            <img src={src} alt={"Track layout"} />
        </div>
    )
}