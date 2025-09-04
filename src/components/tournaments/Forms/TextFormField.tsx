import {IconInput, Input, TitledInput} from "@/components/ui/Input";

export default function TextFormField(
  {id_key, title}: {id_key: string, title: string}
){
  return <TitledInput title={title}>
      <Input type="text" name={id_key}></Input>
  </TitledInput>
}