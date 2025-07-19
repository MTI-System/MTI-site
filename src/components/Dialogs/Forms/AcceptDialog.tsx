import { Button } from "@/components/ui/Button"

function AcceptDialog({ onAccept, onDecline }: { onAccept: Function; onDecline: Function }) {
  return (
    <div>
      <h1>Accept</h1>
      <Button
        onClick={() => {
          onAccept()
        }}
      >
        Подтвердить
      </Button>
      <Button
        onClick={() => {
          onDecline()
        }}
      >
        Отменить
      </Button>
    </div>
  )
}

export default AcceptDialog
