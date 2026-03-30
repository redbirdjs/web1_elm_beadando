import { useMemo, useState } from 'react';
import Input from './App1/Input';
import './App1.css';

export default function App1() {
  const [raceType, setRaceType] = useState<'time' | 'laps'>('time');

  const [raceLength, setRaceLength] = useState<string>('');
  const [min, setMin] = useState<string>('');
  const [sec, setSec] = useState<string>('');
  const [ms, setMs] = useState<string>('');
  const [fuelPerLap, setFuelPerLap] = useState<string>('');
  const [maxFuel, setMaxFuel] = useState<string>('');


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


  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  
  const lapTime = useMemo(() => {
    return (parseInt(min) || 0) + (parseInt(sec) || 0) / 60 + (parseInt(ms) || 0) / 60000 || 1
  }, [min, sec, ms])

  const raceTime = useMemo(() => {
    const _raceLength = parseInt(raceLength) || 0;
    return (raceType === 'time' ? _raceLength : Math.round(_raceLength * lapTime));
  }, [raceType, raceLength, lapTime])

  const raceLaps = useMemo(() => {
    const _raceLength = parseInt(raceLength) || 0;
    return (raceType === 'time' ? Math.ceil(raceTime / lapTime) : _raceLength)
  }, [raceType, raceLength, raceTime, lapTime])

  const minFuel = useMemo(() => {
    const _fuelPerLap = parseFloat(fuelPerLap) || 0;
    return Math.ceil(raceLaps * _fuelPerLap);
  }, [raceLaps, fuelPerLap])

  const recFuel = useMemo(() => {
    const _fuelPerLap = parseFloat(fuelPerLap) || 0;
    return Math.ceil((raceLaps + 1.2) * _fuelPerLap);
  }, [raceLaps, fuelPerLap]);


  const pits = useMemo(() => {
    const _maxFuel = parseInt(maxFuel);
    if (isNaN(_maxFuel) || minFuel <= _maxFuel) return [];

    const pitCount = Math.floor(minFuel / _maxFuel);
    const result = [];
    const fuelPerPit = Math.min(Math.ceil(recFuel / (pitCount + 1)), 120);

    for (let i = 0; i < pitCount; i++) {
      result.push({
        lap: Math.round(((i + 1) / (pitCount + 1)) * raceLaps),
        fuel: fuelPerPit
      });
    }

    return result;
  }, [minFuel, maxFuel, recFuel, raceLaps]);


  return (
    <div className='fuelcalc'>

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
            {[15, 30, 60, 120, 240, 480, 720, 1440].map(t =>
              <button className={raceLength === String(t) ? 'selected' : ''} onClick={() => setRaceLength(String(t))}>
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

      <div className='col col-w-20'>
        <div className='row'>
          <h2>Results</h2>
        </div>

        <div className='result-row result-main'>
          <div>Recommended Fuel</div>
          <div>{recFuel}</div>
        </div>

        <div className='result-row'>
          <div>Minimum Fuel</div>
          <div>{minFuel}</div>
        </div>

        <div className='result-row'>
          <div>{raceType === 'time' ? 'Total Laps' : 'Total Time'}</div>
          <div>{raceType === 'time' ? raceLaps : formatTime(raceTime)}</div>
        </div>

        {pits.length > 0 && <>
          <div className='row mt-2'>
            <h2>Pit Strategy</h2>
          </div>

          {pits.map((pit, index) => 
            <div className='pit-row'>
              <div className='index'>
                #{index + 1}
              </div>
              <div className='pit-data'>
                <div>Lap</div>
                <div>{pit.lap}</div>
              </div>
              <div className='separator'></div>
              <div className='pit-data'>
                <div>Fuel</div>
                <div>+{pit.fuel}</div>
              </div>
            </div>
          )}
        </>}
      </div>
    </div>
  )
}
