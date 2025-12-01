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
    <div className="text-text-main border-border overflow-hidden rounded-2xl border">
      <Accordion.Root className="bg-bg-alt flex w-full flex-col justify-center">
        <Accordion.Item className="">
          <Accordion.Header>
            <Accordion.Trigger className="group text-text-main bg-bg-accent hover:bg-hover relative flex w-full items-baseline justify-between gap-4 py-4 pr-1 pl-3 text-left font-bold text-2xl focus-visible:z-1 focus-visible:outline focus-visible:outline-blue-800 cursor-pointer">
              {containerTitle}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden text-base text-gray-600 transition-[height] ease-out data-ending-style:h-0 data-starting-style:h-0  border-border border-t">
            <div className="p-3">{children}</div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}
