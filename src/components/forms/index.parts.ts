import { CardRoot as Root } from "./root/Root"
import { ConfirmButton } from "./root/ConfirmButton"
import { EditableFormsItems as EdiatableItems } from "./states/EditableFormsContent"
import { DefaultCardItems as DefaultItems } from "./states/DefaulFormsItems"
import { InputField } from "./fields/InputField"
import { DatePickerField } from "./fields/DatePickerField"
import { DropdownField } from "./fields/DropdownField"
import { UserPickerField } from "./fields/UserPickerField"
import { CheckboxField } from "./fields/CheckboxField"
import { FormTrigger as Trigger } from "./root/FormTrigger"

export const Forms = {
  UserPickerField,
  Root,
  EdiatableItems,
  DefaultItems,
  InputField,
  ConfirmButton,
  DatePickerField,
  Trigger,
  DropdownField,
  CheckboxField,
}
