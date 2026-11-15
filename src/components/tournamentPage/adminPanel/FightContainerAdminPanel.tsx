"use client"
import { Accordion, AlertDialog } from "@base-ui-components/react"
import FightsAdmin from "@/components/tournamentPage/adminPanel/FightsAdmin"
import { FightInformationInterface } from "@/types/TournamentsAPI"
import {
  useAddFightMutation,
  useGetFightContainerCardQuery,
  useGetFightInfoByTournamentQuery,
} from "@/api/tournaments/clientApiInterface"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { AdminButton, useAdminFeedback } from "@/components/tournamentPage/adminPanel/adminUi"
import { useState } from "react"

const accordionTriggerClass =
  "group bg-bg-accent text-text-main hover:bg-hover relative flex w-full cursor-pointer items-baseline justify-between gap-4 py-3 pr-3 pl-4 text-left text-lg font-medium focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-primary"

export default function FightContainerAdminPanel({
  fightsInfo,
  fightContainerId,
  tournamentId,
}: {
  fightContainerId: number
  fightsInfo: FightInformationInterface[]
  tournamentId: number
}) {
  const [addFight, { isLoading: isAddingFight }] = useAddFightMutation()
  const token = useAppSelector((state) => state.auth.token)
  const { data } = useGetFightContainerCardQuery({ id: fightContainerId })
  const { refetch } = useGetFightInfoByTournamentQuery({ tournamentId })
  const { run } = useAdminFeedback()
  const [addFightOpen, setAddFightOpen] = useState(false)
  return (
    <Accordion.Item className="border-border bg-bg-alt overflow-hidden rounded-2xl border" key={fightContainerId}>
      <Accordion.Header>
        <Accordion.Trigger className={accordionTriggerClass}>
          <p className="text-text-main">{data?.title ?? "Загрузка..."}</p>
          <PlusIcon className="text-text-main mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel className="border-border h-[var(--accordion-panel-height)] overflow-hidden border-t text-base transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0 data-[open]:h-auto">
        <div className="flex flex-col gap-3 p-3">
          {fightsInfo.map((fight, idx) => (
            <FightsAdmin key={fight.id} fight={fight} idx={idx} tournamentId={tournamentId} />
          ))}
        </div>
        <AdminButton className="m-4" type="button" onClick={() => setAddFightOpen(true)}>
          Добавить бой
        </AdminButton>
        <AlertDialog.Root open={addFightOpen} onOpenChange={setAddFightOpen}>
          <AlertDialog.Portal>
            <AlertDialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
            <AlertDialog.Popup className="bg-bg-alt text-text-main outline-border fixed top-1/2 left-1/2 z-50 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 outline outline-1 transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0">
              <AlertDialog.Title className="-mt-1.5 mb-1 text-lg font-medium">Добавить бой</AlertDialog.Title>
              <AlertDialog.Description className="text-text-alt mb-6 text-base">
                Удалить бой через эту админ-панель будет нельзя.
              </AlertDialog.Description>
              <div className="flex justify-end gap-3">
                <AlertDialog.Close
                  disabled={isAddingFight}
                  className="border-border bg-bg-alt text-text-main hover:bg-hover focus-visible:outline-accent-primary flex h-10 cursor-pointer items-center justify-center rounded-md border px-3.5 text-base font-medium select-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Отмена
                </AlertDialog.Close>
                <AdminButton
                  loading={isAddingFight}
                  onClick={async () => {
                    const ok = await run(
                      addFight({
                        token: token,
                        fightContainerId: Number(fightContainerId),
                      }).unwrap(),
                      { success: "Бой добавлен" },
                    )
                    if (ok) {
                      setAddFightOpen(false)
                      await refetch()
                    }
                  }}
                >
                  Добавить
                </AdminButton>
              </div>
            </AlertDialog.Popup>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </Accordion.Panel>
    </Accordion.Item>
  )
}

function PlusIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
    </svg>
  )
}
