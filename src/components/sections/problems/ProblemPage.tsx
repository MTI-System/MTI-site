import {Problem} from "@/types/problemAPI";

async function ProblemPage({problem}: { problem: Problem }) {
  return <div>
    <h2>{problem.global_number}.{problem.problem_translations[0].problem_name}</h2>
    <p>
      {problem.problem_translations[0].problem_text}
    </p>

    <div>
      <ol>
        {
          problem.problem_materials.map((material, index) => {
            return (<li key={index}>{material.material_name}</li>)
          })
        }
      </ol>
    </div>

  </div>
}

export default ProblemPage;