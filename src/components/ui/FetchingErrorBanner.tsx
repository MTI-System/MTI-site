import style from "@/styles/components/sections/problems/FetchingError.module.css"

function FetchingErrorBanner() {
  return (
    <div className={style.errorCard}>
      <h2>Error loading API response</h2>
      <div className={style.errorLogo}>Error image here</div>
      <p>Error occured while transfering API data. Please check your internet connection or try again later.</p>
    </div>
  )
}

export default FetchingErrorBanner
