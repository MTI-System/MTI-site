import { useCardsRoot } from "./RootContext";


export default function ConfirmButton(
  {
    onClick,
    className = ''
  }: {
    onClick: () => void;
    className?: string;
  }
) {
  const { registeredItemsFunctions } = useCardsRoot()
  return (
    <button type="submit" className={className} onClick={()=>{
      console.log('Confirm button clicked');
      registeredItemsFunctions?.current?.forEach(func => func());
      onClick();
    }}>
      Confirm
    </button>
  );
}