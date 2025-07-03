import TaskCard from "@/components/ui/TaskCard"
import { Problem, ProblemList } from "@/types/problemAPI"

  

async function TasksPage() {
  const response = await fetch(process.env.PROBLEM_API!!)
  const respJSON:ProblemList = await response.json()
  return (
    <div>
      {respJSON.map((problem: Problem, index:number) => <TaskCard problem={problem} key={index+1}></TaskCard>
      )}
    </div>
  )
}
export default TasksPage
