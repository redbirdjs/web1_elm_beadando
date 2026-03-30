import { useMemo, useState } from 'react';

export default function App1() {
  const [raceType, setRaceType] = useState<'time' | 'laps'>('time');

  const [raceLength, setRaceLength] = useState<string>('');
  const [min, setMin] = useState<string>('');
  const [sec, setSec] = useState<string>('');
  const [ms, setMs] = useState<string>('');
  const [fuelPerLap, setFuelPerLap] = useState<string>('');
  const [maxFuel, setMaxFuel] = useState<string>('');


  const setIntValue = (e: React.ChangeEvent<HTMLInputElement>, set: (value: React.SetStateAction<string>) => void) => {
    const num = parseInt(e.target.value);
    if (isNaN(num)) return set('');

    set(String(Math.abs(num)));
  }

  const setFloatValue = (e: React.ChangeEvent<HTMLInputElement>, set: (value: React.SetStateAction<string>) => void) => {
    const num = parseFloat(e.target.value);
    if (isNaN(num)) return set('');

    set(String(Math.abs(num)));
  }

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

  const totalLength = useMemo(() => {
    return (raceType === 'time' ? raceLaps : raceTime)
  }, [raceType, raceLaps, raceTime])

  const minFuel = useMemo(() => {
    const _fuelPerLap = parseFloat(fuelPerLap) || 0;
    return Math.ceil(raceLaps * _fuelPerLap);
  }, [raceLaps, fuelPerLap])

  const recFuel = useMemo(() => {
    const _fuelPerLap = parseFloat(fuelPerLap) || 0;
    return Math.ceil((raceLaps + 1.2) * _fuelPerLap);
  }, [raceLaps, fuelPerLap]);



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
          <div className='input'>
            <input type="number" name="raceLength" id="raceLength" value={raceLength} onChange={(e) => setIntValue(e, setRaceLength)} />
            <label htmlFor="raceLength">{raceType === 'time' ? 'Race length in minutes' : 'Number of laps'}</label>
          </div>

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
          <div className='input'>
            <input type="number" name="lapTimeM" id="lapTimeM" value={min} onChange={(e) => setIntValue(e, setMin)} />
            <label htmlFor="lapTimeM">Minutes</label>
          </div>
          <div className='input'>
            <input type="number" name="lapTimeS" id="lapTimeS" value={sec} onChange={(e) => setIntValue(e, setSec)} />
            <label htmlFor="lapTimeS">Seconds</label>
          </div>
          <div className='input'>
            <input type="number" name="lapTimeMs" id="lapTimeMs" value={ms} onChange={(e) => setIntValue(e, setMs)}/>
            <label htmlFor="lapTimeMs">Miliseconds</label>
          </div>
        </div>

        <div className='row'>
          <h3>Fuel Consumption</h3>
        </div>

        <div className='row'>
          <div className='input'>
            <input type="number" name="fuelPerLap" id="fuelPerLap" value={fuelPerLap} onChange={(e) => setFloatValue(e, setFuelPerLap)} />
            <label htmlFor="fuelPerLap">Fuel per lap</label>
          </div>
        </div>

        <div className='row'>
          <div className='input'>
            <input type="number" name="fuelPerLap" id="fuelPerLap" value={maxFuel} onChange={(e) => setIntValue(e, setMaxFuel)} />
            <label htmlFor="fuelPerLap">Maximum Fuel (Optional)</label>
          </div>
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
          <div>{raceType === 'time' ? totalLength : formatTime(totalLength)}</div>
        </div>
        </div>
    </div>
  )
}
