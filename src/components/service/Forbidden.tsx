export default function Forbidden() {
  return (
    <div className="bg-bg-alt text-text-main mx-30 flex size-full flex-col justify-center gap-2 rounded-2xl py-2">
      <p className="w-full px-10 text-start">
        У вас нет права для на создание турниров на платформе.
        <br />
        Если вы хотите получить права на организацию турниров, обратитесь в поддержку:
      </p>
      <ol>
        <li className="px-10">
          Email: <a href={"mailto:antoon.s.ivanov@gmail.com"}>antoon.s.ivanov@gmail.com</a>
        </li>
        <li className="px-10">
          Телеграм: <a href={"https://t.me/AntonIvanov1111"}>Ссылка</a>
        </li>
      </ol>
    </div>
  )
}
