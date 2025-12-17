// {
//   "pickedProblem": 0,
//   "playerLines": [
//     {
//       "role": {
//         "id": 3,
//         "title": "Рецензент",
//         "baseCoefficient": 1.0
//       },
//       "playerId": 1,
//       "team": {
//         "id": 1,
//         "name": "Команда 1",
//         "global_team_id": 1,
//         "players": [1, 2, 3]
//       },
//       "finalScore": 4.67,
//       "scores": [
//         { "id": 10, "value": 5.0, "jury": 1 }
//       ]
//     },
//   ]
// }

const jury = [
  {"id":1,
    "val":"aboba abobovich",
  },
  {"id":2,
    "val":"aboba abobovich",
  },
  {"id":3,
    "val":"aboba abobovich",
  },
  {"id":4,
    "val":"aboba abobovich",
  },
  {"id":5,
    "val":"aboba abobovich",
  },
  {"id":6,
    "val":"aboba abobovich",
  },
]

import { Avatar } from '@base-ui-components/react/avatar';
export default function ExAvatar({val}:{val:string}) {
  return (
    <div>
      <Avatar.Root className="uppercase inline-flex size-12 items-center justify-center overflow-hidden rounded-full bg-hover align-middle text-base font-medium text-text-main select-none">
        {val}
      </Avatar.Root>
    </div>
  );
}


const teams = [//for example
    {
      "id": 1,
      "name": "Команда 1",
      "score": 38.5,
      "coefficient": 3
    },
    {
      "id": 2,
      "name": "Команда 2",
      "score": 0,
      "coefficient": 3
    },
    {
      "id": 3,
      "name": "Команда 3",
      "score": 10,
      "coefficient": 3
    }
  ]

export function FightCard(){
  return(
  <>
  <a href="" className='max-w-full'>
    <div className="border bg-bg-alt border-border rounded-2xl py-4 px-7 mx-auto ">

      <h2 className="font-bold mx-auto text-2xl text-center mb-5 text-text-main uppercase">room</h2>

        <div className='overflow-x-auto border-b border-border '>
          <FightTable/>
        </div>
        <h2 className="font-bold mx-auto text-2xl text-center mb-5 text-text-main uppercase mt-5">jury</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 w-full justify-items-center mt-5'>
          {jury.map((item) => (
          <div  key={item.id}  className='flex flex-wrap flex-row max-w-15 justify-center items-center'>
          <div className='flex flex-col gap-4 max-w-15 justify-center items-center text-center'>
            <ExAvatar val={item.val[0]}/>
            {item.val}
          </div>
        </div>
      
    ))}
    </div>
    </div>
  </a>
  </>
  )
}

export function FightTable({
    name = true,
    score = true,
    coefficient= true,
    problem= true,
    decline= true,
    D_score= true,
    O_score= true,
    R_score= true,
  }: {
    name?:boolean
    score?:boolean
    coefficient?:boolean
    problem?:boolean
    decline?:boolean
    D_score?:boolean
    O_score?:boolean
    R_score?:boolean
    }){
    return(
        
        <table className="w-full">
            <thead>
                <tr className="border-b-border border-b">
                       {name&&<th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">Название команды</th>}
                      {score&&<th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">Балл за бой</th>}
                {coefficient&&<th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">к</th>}
                    {problem&&<th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">Сыгранная задача</th>}
                    {decline&&<th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">Отказы</th>}
                    {D_score&&<th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">Д</th>}
                    {O_score&&<th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">О</th>}
                    {R_score&&<th className="px-4 py-3 text-center sm:text-sm text-md font-medium text-wrap text-text-main uppercase tracking-wider">Р</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
            {teams.map((item) => (
                <tr key={item.id} className="hover:bg-hover transition-colors text-text-main">
                  {name&&<td className="px-4 py-3 text-center text-sm sm:text-xs font-medium">{item.name}</td>}
                 {score&&<td className="px-4 py-3 text-center text-sm sm:text-xs font-medium">{item.score}</td>}
           {coefficient&&<td className="px-4 py-3 text-center text-sm sm:text-xs font-medium">{item.coefficient}</td>}
                {/* {problem&&<td className="px-4 py-3 text-center text-sm font-medium">{item.problem}</td>}
                {decline&&<td className="px-4 py-3 text-center text-sm font-medium">{item.decline}</td>}
                {D_score&&<td className="px-4 py-3 text-center text-sm font-medium">{item.D_score}</td>}
                {O_score&&<td className="px-4 py-3 text-center text-sm font-medium">{item.O_score}</td>}
                {R_score&&<td className="px-4 py-3 text-center text-sm font-medium">{item.R_score}</td>} */}
                </tr>
            ))}
            </tbody>
        </table>
    )
}