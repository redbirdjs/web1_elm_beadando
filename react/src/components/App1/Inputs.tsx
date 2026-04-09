import Input from "./Input"

type setRaceTypeState = (value: React.SetStateAction<'time' | 'laps'>) => void;
type SetStringState = (value: React.SetStateAction<string>) => void;

export default function Inputs(
  { raceType, setRaceType, raceLength, setRaceLength, min, setMin, sec, setSec, ms, setMs, fuelPerLap, setFuelPerLap, maxFuel, setMaxFuel }:
  {
    raceType: 'time' | 'laps';
    setRaceType: setRaceTypeState;
    raceLength: string;
    setRaceLength: SetStringState;
    min: string;
    setMin: SetStringState;
    sec: string;
    setSec: SetStringState;
    ms: string;
    setMs: SetStringState;
    fuelPerLap: string;
    setFuelPerLap: SetStringState;
    maxFuel: string;
    setMaxFuel: SetStringState;
  }
) {
  const setNumberValue = (e: React.ChangeEvent<HTMLInputElement>, set: (value: React.SetStateAction<string>) => void, parse: (str: string) => number) => {
    let num = parse(e.target.value);
    if (isNaN(num)) return set('');

    const min = e.target.min ? Number(e.target.min) : NaN;
    const max = e.target.max ? Number(e.target.max) : NaN;

    if (!isNaN(min) && num < min) num = min;
    if (!isNaN(max) && num > max) num = max;

    set(String(num));
  }

  const setIntValue = (e: React.ChangeEvent<HTMLInputElement>, set: (value: React.SetStateAction<string>) => void) => setNumberValue(e, set, parseInt);
  const setFloatValue = (e: React.ChangeEvent<HTMLInputElement>, set: (value: React.SetStateAction<string>) => void) => setNumberValue(e, set, parseFloat);

  return (
    <div className='col'>
      <div className='row'>
        <h2>Inputs</h2>
      </div>

      <div className='row'>
        <h3>Race Setup</h3>
      </div>

      <div className='row'>
        <Input
          label={raceType === 'time' ? 'Race length in minutes' : 'Number of laps'}
          type='number'
          name='raceLength'
          min={0}
          value={raceLength}
          onChange={(e) => setIntValue(e, setRaceLength)}
        />

        <button className={raceType === 'time' ? 'selected' : ''} onClick={() => setRaceType('time')}>Time</button>
        <button className={raceType === 'laps' ? 'selected' : ''} onClick={() => setRaceType('laps')}>Laps</button>
      </div>

      {raceType === 'time' &&
        <div className='row quick-time-select'>
          {[15, 30, 60, 120, 240, 480, 720, 1440].map((t, index) =>
            <button key={index} className={raceLength === String(t) ? 'selected' : ''} onClick={() => setRaceLength(String(t))}>
              {t >= 60 ? `${Math.round(t / 60)}h` : `${t}m`}
            </button>
          )}
        </div>
      }

      <div className='row'>
        <h3>Lap Time</h3>
      </div>

      <div className='row'>
        <Input label='Minutes'     type='number' name='lapTimeM'  min={0} max={9999} value={min} onChange={(e) => setIntValue(e, setMin)} />
        <Input label='Seconds'     type='number' name='lapTimeS'  min={0} max={59}   value={sec} onChange={(e) => setIntValue(e, setSec)} />
        <Input label='Miliseconds' type='number' name='lapTimeMs' min={0} max={999}  value={ms}  onChange={(e) => setIntValue(e, setMs)} />
      </div>

      <div className='row'>
        <h3>Fuel Consumption</h3>
      </div>

      <div className='row'>
        <Input label='Fuel per lap' type='number' name='fuelPerLap' min={0} value={fuelPerLap}  onChange={(e) => setFloatValue(e, setFuelPerLap)} />
      </div>

      <div className='row'>
        <Input label='Maximum Fuel (Optional)' type='number' name='maxFuel' min={0} value={maxFuel}  onChange={(e) => setIntValue(e, setMaxFuel)} />
      </div>
    </div>
  )
}