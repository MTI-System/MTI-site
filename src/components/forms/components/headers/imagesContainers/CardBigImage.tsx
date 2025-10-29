import { FILES_SERVER } from "@/constants/APIEndpoints";

export default function CardBigImage({isEditing}: {isEditing: boolean}) {
  return (
    <img
      className="z-0 h-full w-full object-cover"
      src={FILES_SERVER + "bigImagePlaceholder.png"}
      loading="lazy"
      alt="Картинка турнира"
    />
  );
}