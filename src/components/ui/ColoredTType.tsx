export default function ColoredTType({ ttName, ttColor }: { ttName: string; ttColor: string }) {
  return (
    <>
      {ttName.slice(0, 2)}
      <span style={{ color: ttColor }}>{ttName.slice(2)}</span>
    </>
  )
}
