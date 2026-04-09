import { Fragment } from "react";

export default function Results(
  { raceType, raceLaps, raceTime, recFuel, minFuel, pits }:
  {
    raceType: 'time' | 'laps';
    raceLaps: number;
    raceTime: number;
    recFuel: number;
    minFuel: number;
    pits: { lap: number, fuel: number }[];
  }
) {
   const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  return (
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
          <Fragment key={index}>
            {pit.lap === 0 ?
              <div className='result-row result-main pit-start'>
                <div>Recommended Starting Fuel</div>
                <div>{pit.fuel}</div>
              </div>
            :
              <div className='pit-row'>
                <div className='index'>
                  #{index}
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
            }
          </Fragment>
        )}
      </>}
    </div>
  )
}