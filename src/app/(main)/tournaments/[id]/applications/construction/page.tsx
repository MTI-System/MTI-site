import {Constructor} from "@/components/formConstructor";

export default async function ConstructorTournamentRegistrationFormPage(
  { params }: { params: Promise<{ id: number }> }
){  
    const id = (await params).id
    return (
      <>
        <Constructor.Root formType={"registration"} tournamentId={id}>
          <Constructor.Layout/>
        </Constructor.Root>
      </>
    )
}