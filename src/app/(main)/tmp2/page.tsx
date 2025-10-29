import CheckRegistrations from "@/components/cards/components/tests/CheckRegistrations"
import { Cards } from "@/components/cards"
import CardTitle from "@/components/cards/components/fields/Title/CardTitle"

export default async function SecondTmp() {
  return (
    <>
      <Form.Root isEdit={true} isExpanded={false}>
        <Form.Layout.Cards.Problem>
        {/*<Form.Layout.Cards.Tournamnt>*/}
          <Cards.EdiatableItems>
            <Form.Cards.Title.Input />
            <CheckRegistrations />
            <p>Editable Card Items</p>
          </Cards.EdiatableItems>
          <Cards.DefaultItems>
            <Cards.Title.Content title="Заголовок"/>
          </Cards.DefaultItems>
        </Cards.Layout>
      </Form.Root>
    </>
  )
}
