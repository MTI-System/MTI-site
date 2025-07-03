import { Problem } from "@/types/problemAPI"
import "@/styles/problems/taskcard.css"

export default function TaskCard( {problem} : {problem:Problem}){
    
    return (
        <div className="taskCard">
            <h3>{problem.global_number}.{problem.problem_translations[0].problem_name}</h3>
            <p>{problem.problem_translations[0].problem_text}</p>
        </div>
    )
}