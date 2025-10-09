import { Input } from "@/components/ui/Input"
import { useCallback, useEffect, useState } from "react"
import { Popover } from "@base-ui-components/react"

type ContainerInterface = {
  id: number
  name: string
}

export default function FightsInformations() {
  const [fightContainers, setFightsContainers] = useState<ContainerInterface[]>([])
  useEffect(() => {
    console.log("FightsInformations loaded", fightContainers)
  }, [fightContainers])

  const changeContainer = useCallback(
    (id: number, value: string) => {
      const newContainers: ContainerInterface[] = []
      fightContainers.forEach((c, index) => {
        if (id === c.id) {
          newContainers.push({
            id: c.id,
            name: value,
          })
        } else {
          newContainers.push(c)
        }
      })
      setFightsContainers(newContainers)
    },
    [fightContainers],
  )

  return (
    <>
      <div className="flex h-fit justify-between">
        <h2 className="text-xl font-medium">Конструктор информации о боях</h2>
        <Popover.Root>
          <Popover.Trigger className="flex size-7 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-[popup-open]:bg-gray-100">
            <div className="aspect-square h-full">?</div>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={8} align={"end"}>
              <Popover.Popup className="origin-[var(--transform-origin)] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                <Popover.Title className="text-base font-medium">
                  Добавьте список боев, которые будут играться на турнире!
                </Popover.Title>
                <Popover.Description className="text-base text-gray-600">
                  Каждый добавленный пунки - это один отборочный бой или финал.
                  <br />
                  Пример списка:
                  <ol className="ms-5 list-disc">
                    <li>Первый отборочный бой</li>
                    <li>Второй отборочный бой</li>
                    <li>Финал</li>
                  </ol>
                </Popover.Description>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <div className="flex flex-col gap-2 py-2">
        {fightContainers.map((container, index) => (
          <>
            <div className="flex flex-col justify-between" key={`fights-${container.id}`}>
              <div className="flex justify-between">
                <Input
                  className="border-border h-[3rem] w-[30rem] rounded-full border-[1px] p-2 text-[0.8rem]"
                  defaultValue={container.name}
                  onChange={(e) => {
                    changeContainer(container.id, e.target.value)
                  }}
                />

                <button
                  className="mt-2 h-[2.5rem] w-[6rem] rounded-2xl border border-[#ED0F4E] bg-[#ED0F4E]/20 text-[#ED0F4E] hover:bg-[#ED0F4E]/50"
                  onClick={() => setFightsContainers([...fightContainers].filter((f, idx) => f.id !== container.id))}
                >
                  Удалить
                </button>
              </div>
            </div>
          </>
        ))}
      </div>
      <button
        className="bg-accent-primary/20 hover:bg-accent-primary/50 border-accent-primary text-accent-primary mt-2 h-[2.5rem] w-full rounded-2xl border"
        onClick={() => {
          setFightsContainers([
            ...fightContainers,
            {
              id: (fightContainers[fightContainers.length - 1]?.id ?? 0) + 1,
              name: "Название боя (отборочный или финал)",
            },
          ])
        }}
      >
        Добавить раздел
      </button>
    </>
  )
}

// function 