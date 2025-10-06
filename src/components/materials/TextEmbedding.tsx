import style from "@/styles/components/ui/Files/fileEmbeddings.module.css";
import {ReactNode, SyntheticEvent} from "react";


export function TextEmbedding({ title, text }: { title: string; text: string } ) {
    return (
        <div className="">
            <h4 className="text-3xl font-bold">{title}</h4>
            <p>{text}</p>
        </div>
    )
}