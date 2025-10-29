import {CardTitleContent} from "./CardTitleContent";
import CardTitleInput from "./CardTitleInput";

export default function CardTitle({ 
  title,
  type = "content"
}: { 
  title?: string,
  type?: "content" | "input"
}) {
  return (
    <>
      {type === "content" && <CardTitleContent title={title ?? ""} />}
      {type === "input" && <CardTitleInput/>}
    </>
  );
}