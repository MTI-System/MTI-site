"use client"
import {Button} from "@/components/ui/Buttons";
import {ComponentProps, useRef, useState} from "react";
import {FaTimes} from "react-icons/fa"
import {FaRegCopy} from "react-icons/fa6";
import {Checkbox, CheckboxGroup, Form, Tooltip} from "@base-ui-components/react"
import {Field} from "@base-ui-components/react/field";
import * as sea from "node:sea";
import {usePathname, useSearchParams} from "next/navigation";
import {FaShare} from "react-icons/fa";

function SearchParamTranscript(flag: string): string {
    switch (flag) {
        case "tt":
            return "Тип турнира"
        case "year":
            return "Год"
        case "sections":
            return "Фильтры разделов наук"
        default:
            return "Неизвестный параметр"
    }
}

interface EditableSearchParamInterface {
    key: string;
    value: string;
    state: boolean;
    transcription: string;
}

export default function ShareButton() {
    const searchParams = Object.fromEntries(Array.from(useSearchParams().entries()));
    const [isExpanded, setExpanded] = useState(false);
    const pathname = usePathname()
    const [editableSearchParams, setEditableSearchParams] = useState<EditableSearchParamInterface[]>(Object.entries(searchParams)
        .map(([key, value]) => {
            return {
                key: key,
                value: value as string,
                state: true,
                transcription: SearchParamTranscript(key),
            };
        }));

    const getSearchParamsText = function (): string {
        const spObj = new URLSearchParams()
        editableSearchParams.forEach(searchParam => {
            if (searchParam.state) {
                spObj.set(searchParam.key, searchParam.value);
            }
        })
        return spObj.toString()
    }
    const [isCopied, setCopied] = useState(false);
    const checkBoxHandler = function (key: string, state: boolean) {
        setEditableSearchParams(prevState => {
            return prevState.map(sp => {
                return {
                    key: sp.key,
                    value: sp.value,
                    state: sp.key === key ? state : sp.state,
                    transcription: sp.transcription,
                }
            })
        })
    }
    return (
        <>
            <div className="relative z-10">
                <Button
                    className="group relative border-3 border-green-400 bg-green-400/10 hover:bg-green-400 px-2 py-2 rounded-xl
               text-text-main transition-all duration-300 ease-in-out overflow-hidden
               w-auto min-w-[4px] hover:min-w-[7.5rem]"
                    onClick={() => setExpanded(!isExpanded)}>
                    <div className="flex items-center justify-center gap-2">
                        {/* Иконка - всегда видима */}
                        <span className="transition-all duration-300 opacity-100 group-hover:opacity-0">
                            <FaShare/>
                        </span>

                        {/* Текст - скрыт по умолчанию, появляется при наведении */}
                        <span className="absolute left-2 transition-all duration-300 opacity-0 group-hover:opacity-100
                        translate-x-[0px] group-hover:translate-x-0">
                            Поделиться
                        </span>

                        {/* Иконка - дублируется для плавного перехода */}
                        {/*<span className="transition-all duration-300 opacity-0 group-hover:opacity-100*/}
                        {/*translate-x-[-10px] group-hover:translate-x-0">*/}
                        {/*    <FaShare/>*/}
                        {/*</span>*/}
                    </div>
                </Button>
                {isExpanded &&
                    <div
                        className="absolute bg-bg-alt rounded-2xl border-1 border-border w-[30rem] h-fit right-0 mt-1 py-3">
                        <div className="relative px-2 ">
                            <FaTimes className="absolute right-0 me-2" onClick={() => setExpanded(false)}/>
                            <h3 className="text-xl">Поделиться ссылкой на страницу!</h3>
                            <div className="w-full flex items-center border-1 rounded-lg justify-between px-2 my-2">
                                <p className="overflow-auto text-nowrap w-[90%]
             [-ms-overflow-style:none] [scrollbar-width:none]
             [&::-webkit-scrollbar]:hidden">https://mtiyt.ru{pathname}?{getSearchParamsText()}</p>
                                <Tooltip.Provider>
                                    <Tooltip.Root open={isCopied}>
                                        <Tooltip.Trigger>
                                            <FaRegCopy onClick={async () => {
                                                await navigator.clipboard.writeText(`https://mtiyt.ru${pathname}?${getSearchParamsText()}`).then(() => {
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                })

                                            }}/>
                                        </Tooltip.Trigger>
                                        <Tooltip.Portal>
                                            <Tooltip.Positioner sideOffset={10}>
                                                <Tooltip.Popup
                                                    className="transition-[transform,scale,opacity]  data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[instant]:duration-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0">
                                                    <p className="border-border bg-bg-alt text-text-main rounded-md border-2 px-2 py-1">
                                                        Скопированно в буфер обмена
                                                    </p>
                                                </Tooltip.Popup>
                                            </Tooltip.Positioner>
                                        </Tooltip.Portal>
                                    </Tooltip.Root>
                                </Tooltip.Provider>
                            </div>
                            <p className="pb-2">Вы можете поделиться страницей с уже отфильтрованными значениями. В
                                данном окне вы можете
                                выбрать фильтры, которые
                                будут учтены в ссылке. В поисковой строке вашего браузера вы можете скопировать
                                ссылку <strong>со всеми параметрами</strong>
                            </p>
                            <SearchParamCheckBoxes searchParams={editableSearchParams} onChecked={checkBoxHandler}/>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}


function SearchParamCheckBoxes({searchParams, onChecked}: {
    searchParams: EditableSearchParamInterface[],
    onChecked: (key: string, state: boolean) => void
}) {
    const formRef = useRef(null);
    return (
        <>
            <CheckboxGroup
                aria-labelledby="apples-caption"
                defaultValue={searchParams.map((sp) => sp.key)}
                className="flex flex-col items-start gap-1 text-text-main"
            >
                {searchParams.map((sp) => <label key={sp.key} className="flex items-center gap-2">
                        <Checkbox.Root
                            name={sp.key}
                            value={sp.key}
                            onCheckedChange={(state) => {
                                onChecked(sp.key, state)
                                // console.log("SearchParams", new FormData(formRef.current??undefined), formRef.current)
                            }}
                            className="box-border flex w-5 h-5 items-center justify-center rounded outline-none p-0 m-0
                                   data-[checked]:bg-text-main border border-border
                                   focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2
                                   transition-colors data-[checked]:border-transparent"
                        >
                            <Checkbox.Indicator className="flex text-bg-alt data-[unchecked]:hidden">
                                <CheckIcon className="w-3 h-3"/>
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        {sp.transcription}
                    </label>
                )}
            </CheckboxGroup>
        </>
    )
}

function CheckIcon(props: ComponentProps<'svg'>) {
    return (
        <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
            <path
                d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z"/>
        </svg>
    );
}