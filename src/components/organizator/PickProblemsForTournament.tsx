"use client"
import { Checkbox, CheckboxGroup, Form, Tooltip } from "@base-ui-components/react"
import { CheckIcon } from "../problems/ShareButton"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useGetProblemsQuery } from "@/api/problems/clientApiInterface"
import Loading from "@/app/loading"

export default function PickProblemsForTournament({year}: {year: number}) {
  const tt = useAppSelector(state => state.searchParams.tt)
  
  const {data, error, isLoading} = useGetProblemsQuery({year: year, tournament: (tt??1).toString()})
  return (
    <>
      <h2 className="text-xl font-medium">Выбирите задачи для турнира</h2>
      <div className="mt-2">
        {isLoading && <Loading/>}
        {!isLoading && <CheckboxGroup
          aria-labelledby="apples-caption"
          //   defaultValue={searchParams.map((sp) => sp.key)}
          className="text-text-main flex flex-col items-start gap-1"
        >
          {data?.map((problem)=>(
          <label key={1} className="flex items-center gap-2">
            <Checkbox.Root
              name={problem.problem_translations[0].problem_name}
              value={problem.id.toString()}
              onCheckedChange={(state) => {
                // onChecked(sp.key, state)
                console.log("selected problems", state)
              }}
              className="data-[checked]:bg-text-main border-border m-0 box-border flex h-5 w-5 items-center justify-center rounded border p-0 transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 data-[checked]:border-transparent"
            >
              <Checkbox.Indicator className="text-bg-alt flex data-[unchecked]:hidden">
                <CheckIcon className="h-3 w-3" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            {problem.global_number}.{problem.problem_translations[0].problem_name}
          </label>
          ))}

        </CheckboxGroup>}
      </div>
    </>
  )
}
