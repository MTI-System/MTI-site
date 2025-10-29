import { FILES_SERVER } from "@/constants/APIEndpoints";

export default function BigCardHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "bg-bg-alt border-bg-main flex flex-col overflow-hidden rounded-3xl border-2 transition-all duration-500 h-[33rem] w-full"}
    >
      <div className="relative h-[64%]">
        {children}
      </div>
    </div>
  );
}
