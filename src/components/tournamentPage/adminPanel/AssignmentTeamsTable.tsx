"use client"
import { Select } from "@base-ui-components/react"
export default function AssignmentTeamsTable({
    teams,
    selections,
    onChange,
}: {
    teams: { value: number; label: string; }[],
    selections: (number | null)[],
    onChange: (index: number, value: number | null) => void
}) {
    return (
        <>
            {teams && <div className="border-border rounded-2xl border w-full">
                <table className="w-full table-fixed text-text-main">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="w-[20%] py-1.5 border-r border-border">№</th>
                            <th className="w-[80%] py-1.5">Название команды</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selections.map((_, index) => (
                            <tr key={index}>
                                <td className="w-[20%] text-center border-r border-border">{index + 1}</td>
                                <td className="w-[80%] p-0.5">
                                    <Select.Root items={teams} onValueChange={(value) => onChange(index, value)}>
                                        <Select.Trigger className={`flex text-text-main h-10 min-w-36 w-full items-center justify-between gap-3 rounded-md pr-3 pl-3.5 text-base select-none hover:bg-hover data-[popup-open]:bg-bg-main ${index == selections.length - 1 ? "rounded-br-2xl" : ""}`}>
                                            <Select.Value className="w-full text-ellipsis overflow-hidden whitespace-nowrap" />
                                            <Select.Icon className="flex">
                                                <ChevronUpDownIcon />
                                            </Select.Icon>
                                        </Select.Trigger>
                                        <Select.Portal>
                                            <Select.Positioner className="z-10 outline-none select-none" sideOffset={8}>
                                                <Select.Popup className="group text-text-main min-w-[var(--anchor-width)] origin-[var(--transform-origin)] rounded-md bg-[canvas] bg-clip-padding shadow-lg shadow-border outline outline-1 outline-border transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none dark:shadow-none">
                                                    <Select.ScrollUpArrow className="top-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:top-[-100%]" />
                                                    <Select.List className="relative max-h-[var(--available-height)] scroll-py-6 overflow-y-auto py-1">
                                                        {teams.map((team) => (
                                                            <Select.Item
                                                                key={team.label}
                                                                value={team.value}
                                                                className="grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 p-2 text-sm leading-4 outline-none select-none group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"
                                                            >
                                                                <Select.ItemIndicator className="col-start-1">
                                                                    <CheckIcon className="size-3" />
                                                                </Select.ItemIndicator>
                                                                <Select.ItemText className="col-start-2">{team.label}</Select.ItemText>
                                                            </Select.Item>
                                                        ))}
                                                    </Select.List>
                                                    <Select.ScrollDownArrow className="bottom-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:bottom-[-100%]" />
                                                </Select.Popup>
                                            </Select.Positioner>
                                        </Select.Portal>
                                    </Select.Root>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}
        </>
    )
}

function ChevronUpDownIcon(props: React.ComponentProps<"svg">) {
    return (
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentcolor" strokeWidth="1.5" {...props}>
            <path d="M0.5 4.5L4 1.5L7.5 4.5" />
            <path d="M0.5 7.5L4 10.5L7.5 7.5" />
        </svg>
    )
}

function CheckIcon(props: React.ComponentProps<"svg">) {
    return (
        <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
            <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
        </svg>
    )
}