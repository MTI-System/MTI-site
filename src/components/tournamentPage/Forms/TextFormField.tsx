
import { Field } from "@base-ui-components/react/field";

export default function TextFormField(
  {id_key, title}: {id_key: string, title: string}
){
  return (
      <>
          <Field.Root className="flex gap-1">
              <Field.Label>{title}</Field.Label>
              <Field.Control required={true} name={id_key}></Field.Control>
          </Field.Root>
      </>
  )
  //   <TitledInput title={title}>
  //     <Input type="text" name={id_key}></Input>
  // </TitledInput>
}