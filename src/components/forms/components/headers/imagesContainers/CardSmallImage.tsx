import { FILES_SERVER } from "@/constants/APIEndpoints";

export default function CardSmallImage({isEditing}: {isEditing: boolean}) {
  return (
  <div className="z-1 flex h-0 w-full items-center pl-5">
    <div className="bg-bg-alt border-border relative mb-6 aspect-square size-20 overflow-hidden rounded-full border">
      <img
        src={FILES_SERVER + "bigImagePlaceholder.png"}
        loading="lazy"
        className="absolute size-full object-cover"
        alt="лого"
      />
    </div>
  </div>
  );
}