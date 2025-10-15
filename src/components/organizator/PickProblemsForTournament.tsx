"use client"
import { Checkbox, CheckboxGroup, Form, Tooltip } from "@base-ui-components/react"
import { CheckIcon } from "../problems/ShareButton"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useGetProblemsQuery } from "@/api/problems/clientApiInterface"
import Loading from "@/app/loading"
import { TournamentCardCallback } from "@/app/(main)/organizators/create/page"
import { useEffect, useState } from "react"
import twclsx from "@/utils/twClassMerge"

export default function PickProblemsForTournament({
  year,
  onUpdateCreate,
  errors = [],
}: {
  year: number
  onUpdateCreate: TournamentCardCallback
  errors?: { key: string; message: string }[]
}) {
  const tt = useAppSelector((state) => state.searchParams.tt)
  const [errorsInternal, setErrorsInternal] = useState(errors)
  useEffect(() => {
    setErrorsInternal(errors)
  }, [errors])

  const { data, error, isLoading } = useGetProblemsQuery({ year: year, tournament: (tt ?? 1).toString() })
  const [selectedList, setSelectedList] = useState<string[]>([])
  useEffect(() => {
    onUpdateCreate({
      problems: selectedList.map((it) => Number(it)),
    })
  }, [selectedList])

  useEffect(() => {
    setSelectedList([])
  }, [data])
  return (
    <>
      <Tooltip.Root disabled={errorsInternal.length === 0 || !errorsInternal.some((error) => error.key === "problems")}>
        <Tooltip.Trigger>
          <h2
            className={twclsx(
              "text-xl font-medium transition-colors",
              errorsInternal.some((error) => error.key === "problems") && "text-red-500",
            )}
          >
            Выбирите задачи для турнира
          </h2>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={10} className="z-10">
            <Tooltip.Popup className="flex origin-[var(--transform-origin)] flex-col rounded-md bg-[canvas] px-2 py-1 text-sm shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[instant]:duration-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
              <p className="text-red-500">{errorsInternal.find((error) => error.key === "problems")?.message ?? ""}</p>
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>

      <div className="mt-2">
        {isLoading && <Loading />}
        {!isLoading && (
          <CheckboxGroup
            aria-labelledby="apples-caption"
            value={selectedList}
            onValueChange={(value) => {
              setErrorsInternal(errorsInternal.filter((error) => error.key !== "problems"))
              setSelectedList(value)
            }}
            allValues={data?.map((d) => d.id.toString()) ?? []}
            //   defaultValue={searchParams.map((sp) => sp.key)}
            className="text-text-main flex flex-col items-start gap-1"
          >
            {data?.map((problem) => (
              <label key={problem.id} className="flex items-center gap-2">
                <Checkbox.Root
                  name={problem.problem_translations[0].problem_name}
                  value={problem.id.toString()}
                  className="data-[checked]:bg-text-main border-border m-0 box-border flex h-5 w-5 items-center justify-center rounded border p-0 transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 data-[checked]:border-transparent"
                >
                  <Checkbox.Indicator className="text-bg-alt flex data-[unchecked]:hidden">
                    <CheckIcon className="h-3 w-3" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                {problem.global_number}.{problem.problem_translations[0].problem_name}
              </label>
            ))}
          </CheckboxGroup>
        )}
      </div>
    </>
  )
}
