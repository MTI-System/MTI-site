import { ReactNode } from "react"
import style from "@/styles/components/ui/contentContainer.module.css"
import { Accordion } from "@base-ui-components/react"

export default function ContentContainer({
  children,
  containerTitle,
}: {
  children: ReactNode
  containerTitle: string
}) {
  return (
    <div className="text-text-main border-border border rounded-2xl overflow-hidden">
        <Accordion.Root className="flex w-full bg-bg-alt flex-col justify-center">
            <Accordion.Item className="">
                <Accordion.Header>
                    <Accordion.Trigger className="group text-2xl text-text-main relative flex w-full items-baseline justify-between gap-4 bg-bg-accent py-5 pr-1 pl-3 text-left font-medium hover:bg-hover focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
                        {containerTitle}
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden text-base text-gray-600 transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
                    <div className="p-3">
                        {children}
                    </div>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion.Root>
    </div>
  )
}
