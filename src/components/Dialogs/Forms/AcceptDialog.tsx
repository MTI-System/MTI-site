import BlueButton from "@/components/Default/BlueButton";

function AcceptDialog(
  {onAccept, onDecline}:
  {
    onAccept: Function,
    onDecline: Function
  }
) {
  return (
    <div>
      <h1>Accept</h1>
      <BlueButton onClick={() => {onAccept()}}>Подтвердить</BlueButton>
      <BlueButton onClick={() => {onDecline()}}>Отменить</BlueButton>
    </div>
  )
}

export default AcceptDialog