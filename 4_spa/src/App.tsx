import { useEffect, useRef, useState } from 'react'
import './App.css'
import App1 from './components/App1'
import App2 from './components/App2'

function App() {
  const apps = [
    { name: "Fuel Calculator", element: <App1 /> },
    { name: "Track Guessr", element: <App2 /> },
  ];

  const [currentApp, setCurrentApp] = useState<number>(0);

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [style, setStyle] = useState<React.CSSProperties>({
    "--left": `0px`,
    "--width": `100px`
  } as React.CSSProperties)

  useEffect(() => {
    const el = buttonRefs.current[currentApp];
    if (el) {
      const { offsetLeft, offsetWidth } = el;

      setStyle({
        "--left": `${offsetLeft}px`,
        "--width": `${offsetWidth}px`
      } as React.CSSProperties);
    }
  }, [currentApp]);

  return (
    <div className='container'>
      <header>
        <h1>Single Page Application</h1>
        <h1>{apps[currentApp].name}</h1>
        <nav>
          <div className='selected' style={style}></div>
          {apps.map((app, index) =>
            <button
              key={index}
              ref={(el) => {buttonRefs.current[index] = el}}
              onClick={() => currentApp !== index && setCurrentApp(index)}>{app.name}</button>
          )}
        </nav>
      </header>

      <main>
        {apps[currentApp].element}
      </main>
    </div>
  )
}

export default App
