import { useCardsRoot } from "./RootContext";


export function ConfirmButton(
  {
    onClick,
    className = ''
  }: {
    onClick: () => void;
    className?: string;
  }
) {
  const { items } = useCardsRoot()
  console.log("registered", items)
  return (
    <button type="submit" className={className} onClick={()=>{
      console.log(`Confirm button clicked ${items?.length}`, items);
      items?.forEach(func => {
          console.log("Execute func", func.id);
          func.func()
      });
      onClick();
    }}>
      Confirm
    </button>
  );
}