import footerStyle from "@/styles/app/footer.module.css";


export default function LogoWithTT({logoSize, margin}: {logoSize: string, margin: string}) {
  return (
    <div>
      <h2 className={footerStyle.mainBioHeaderText} style={{fontSize:logoSize}}>МТИ</h2>
      <p className={footerStyle.ttBioHeaderText}  style={{fontSize:logoSize, marginTop: margin}}>ТЮФ</p>
      {/*TODO Сделать корректное отображение типа турнира*/}
    </div>
  )
}