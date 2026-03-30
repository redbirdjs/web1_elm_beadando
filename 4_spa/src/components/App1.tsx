import { useMemo, useState } from 'react';
import Inputs from './App1/Inputs';
import Results from './App1/Results';
import './App1.css';

export default function App1() {
  const [raceType, setRaceType] = useState<'time' | 'laps'>('time');

  const [raceLength, setRaceLength] = useState<string>('');
  const [min, setMin] = useState<string>('');
  const [sec, setSec] = useState<string>('');
  const [ms, setMs] = useState<string>('');
  const [fuelPerLap, setFuelPerLap] = useState<string>('');
  const [maxFuel, setMaxFuel] = useState<string>('');


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
    const _fuelPerLap = parseFloat(fuelPerLap) || 0;
    if (isNaN(_maxFuel) || minFuel <= _maxFuel || _fuelPerLap > _maxFuel) return [];

    const pitCount = Math.floor(minFuel / _maxFuel);
    const result = [];
    const fuelPerPit = Math.min(Math.ceil(recFuel / (pitCount + 1)), 120);

    result.push({
      lap: 0,
      fuel: fuelPerPit
    })

    for (let i = 0; i < pitCount; i++) {
      result.push({
        lap: Math.round(((i + 1) / (pitCount + 1)) * raceLaps),
        fuel: fuelPerPit
      });
    }

    return result;
  }, [minFuel, maxFuel, recFuel, fuelPerLap, raceLaps]);


  return (
    <div className='fuelcalc'>

      <Inputs
        raceType={raceType}
        setRaceType={setRaceType}
        raceLength={raceLength}
        setRaceLength={setRaceLength}
        min={min}
        setMin={setMin}
        sec={sec}
        setSec={setSec}
        ms={ms}
        setMs={setMs}
        fuelPerLap={fuelPerLap}
        setFuelPerLap={setFuelPerLap}
        maxFuel={maxFuel}
        setMaxFuel={setMaxFuel}
      />

      <Results
        raceType={raceType}
        raceLaps={raceLaps}
        raceTime={raceTime}
        recFuel={recFuel}
        minFuel={minFuel}
        pits={pits}
      />
    </div>
  )
}
