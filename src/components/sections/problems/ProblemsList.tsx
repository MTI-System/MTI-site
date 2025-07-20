"use server"
import ProblemCard from "@/components/sections/problems/ProblemCard"
import { Problem, ProblemList } from "@/types/problemAPI"
import { fetchPermissions, fetchProblems } from "@/scripts/ApiFetchers"
import FetchingErrorBanner from "@/components/ui/FetchingErrorBanner"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import { AddProblem } from "./ProblemForms"
import { cookies } from "next/headers"
import { User } from "@/types/authApi"

export default async function ProblemsList({ year, tt }: { year: number; tt: string }) {
  const respJSON: ProblemList | null = await fetchProblems(
    availableTournamentTypes.find((value) => value.name === tt)!!.id.toString(),
    year
  )
  // const respJSON: ProblemList | null = [
  //   {
  //     id: 1,
  //     global_number: 1,
  //     year: 2024,
  //     tournament_type: 1,
  //     problem_translations: [{ id: 1, problem_name: "TMP", problem_text: "Some lorem ipsum", problem_by: "" }],
  //     problem_materials: [],
  //   },
  // ]
  const userAuth = await fetchPermissions()
  // const userAuth: User = {
  //   user_id: 1,
  //   username: "test_user1",
  //   email: "example@gmail.com",
  //   rights: [{ id: 1, right_title: "edit", right_flag: "MODERATE_PROBLEMS_1" }],
  // }
  let isEditable = false
  if (userAuth && userAuth.rights.length !== 0) {
    isEditable = userAuth.rights
      .map(
        (right) =>
          right.right_flag == "MODERATE_PROBLEMS_" + availableTournamentTypes.find((val) => val.name === tt)?.id
      )
      .some((x) => x)
  }

  return (
    <>
      {/* {isEditable && <AddProblem isShown={isEditable} />} */}
      {respJSON &&
        respJSON.map((problem: Problem, index: number) => (
          <ProblemCard problem={problem} isEditable={isEditable} key={index + 1}></ProblemCard>
        ))}
      {respJSON === null && <FetchingErrorBanner />}
    </>
  )
}
