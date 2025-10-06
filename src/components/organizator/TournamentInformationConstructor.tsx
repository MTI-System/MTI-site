import {useEffect, useState} from "react";
import {
    EmbeddingInterface,
    EmbeddingMetadataSchema,
    EmbeddingTypeInterface,
    EmbeddingTypeSchema
} from "@/types/embeddings";
import Loading from "@/app/loading";
import {fetchAllAvailableEmbeddingTypes} from "@/scripts/ApiFetchers";
import {Input} from "@/components/ui/Input";
import {
    Dropdown,
    DropdownElement,
    DropdownMulti,
    DropdownMultiElement,
    DropdownOptionInterface,
    DropdownTrigger,
} from "@/components/ui/Dropdown"
import twclsx from "@/utils/twClassMerge";
import {setYear} from "@/redux_stores/Problems/ProblemsFiltersSlice";
import { Popover } from "@base-ui-components/react";

type MaterialInterface = {
    title: string;
    content: string;
    contentType: EmbeddingTypeInterface;
}

export default function TournamentInformationConstructor() {
    const [contentTypes, setContentTypes] = useState<EmbeddingTypeInterface[]|null>(null);
    const [materials, setMaterials] = useState<MaterialInterface[]>([])
    useEffect(() => {
        fetchAllAvailableEmbeddingTypes().then(r=>{
            setContentTypes(r)
        })
    }, []);
    if (!contentTypes) return <Loading/>;

    const dropdownEls = contentTypes.map((item, i) => (
        {
            children: <h1>{item.display_name}</h1>,
            value: item.id,
        }
    ))
    return (
        <>
            <div className="flex justify-between">
                <h2 className="text-xl font-medium">Конструктор главной страницы турнира</h2>
                <Popover.Root>
                    <Popover.Trigger className="flex size-7 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-[popup-open]:bg-gray-100">
                        <div className="aspect-square h-full">?</div>
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Positioner sideOffset={8} align={"end"}>
                            <Popover.Popup className="origin-[var(--transform-origin)] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                                <Popover.Title className="text-base font-medium">Конструктор страницы с информацией для участников</Popover.Title>
                                <Popover.Description className="text-base text-gray-600">
                                    Соберите всю необходимую информацию для участников.<br/>
                                    Вы можете прикрепить любые виды данных на этой странице.<br/>
                                    <strong>Не забудьте регламент!</strong><br/>
                                    Эту страницу можно будет редактировать позже


                                </Popover.Description>
                            </Popover.Popup>
                        </Popover.Positioner>
                    </Popover.Portal>
                </Popover.Root>
            </div>

            <div className="flex flex-col gap-2 py-2">
                {
                    materials.map((material, index) => (
                        <>
                            <div className="flex flex-col justify-between">
                                <div className="flex justify-between">
                                    <div className="flex gap-2">
                                        <Input className="border-border w-[30rem] h-[3rem] rounded-full border-[1px] p-2  text-[0.8rem]"
                                               defaultValue={material.title}/>
                                        <Dropdown
                                            trigger={<DropdownTrigger className={twclsx(
                                                "bg-bg-alt w-[10rem] justify-between rounded-full h-full hover:bg-hover"
                                            )}>{"Текст"}</DropdownTrigger>}
                                            onOptionSelect={(option: DropdownOptionInterface<number> | null) => {
                                                if (!option) return
                                                // problemDispatcher(setYear(option.value))
                                            }}

                                        >
                                            {dropdownEls.map((opts, i) => (
                                                <DropdownElement key={i + 1} {...opts} />
                                            ))}
                                        </Dropdown>
                                    </div>

                                    <button className="bg-[#ED0F4E]/20 border hover:bg-[#ED0F4E]/50 border-[#ED0F4E] text-[#ED0F4E] h-[2.5rem] rounded-2xl w-[6rem] mt-2">Удалить</button>
                                </div>
                                {
                                    material.contentType.type_name === "Text" ? (
                                        <>
                                            <textarea className="border-border text-xs h-20 w-full resize-none rounded-2xl border-[1px] p-2 mt-2" defaultValue={material.content}>

                                            </textarea>
                                        </>
                                    ) : <h1>Неподходящий тип данных (TODO)</h1>
                                }
                            </div>

                        </>
                    ))
                }
            </div>

            <button
                className="bg-accent-primary/20 border hover:bg-accent-primary/50 border-accent-primary text-accent-primary h-[2.5rem] rounded-2xl w-full mt-2"
                onClick={() => setMaterials([...materials,
                    {
                        title: "Новый элемент",
                        content: "содержание",
                        contentType: contentTypes[0]
                    }
                ])}
            >
                Добавить раздел
            </button>
        </>
    )
}