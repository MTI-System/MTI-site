


// {    
//   "actions": [
//         1,
//         2
//     ],
//   "is_location_link": false,
//   "location": "Ссылка на конфу",
//   "startTime": 1765880319000,
//   "jouries": [1, 2, 3, 4, 5],
//   "teams": [
//     {
//       "id": 1,
//       "name": "Команда 1",
//       "score": 38.5,
//       "coefficient": 3
//     },
//     {
//       "id": 2,
//       "name": "Команда 2",
//       "score": 0,
//       "coefficient": 3
//     }
//   ]
// }

import { FightCard } from "./FightTable";

export default function FightList(){
    return(
         //<div className="flex flex-col gap-5">
        <div className="flex flex-wrap justify-center gap-5">
        <FightCard/>
        <FightCard/>
        <FightCard/>
        <FightCard/>
        </div>
    )
}