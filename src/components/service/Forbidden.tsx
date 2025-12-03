export default function Forbidden(){
  return (
    <div className="bg-bg-alt mx-30 flex size-full justify-center rounded-2xl flex-col gap-2">
      <p className="text-start w-full px-10">У вас нет права для на создание турниров на платформе.<br/>Если вы хотите получить права на организацию турниров, обратитесь в поддержку:</p>
      <ol>
        <li className="px-10">Email: <a href={"mailto:antoon.s.ivanov@gmail.com"}>antoon.s.ivanov@gmail.com</a></li>
        <li className="px-10">Телеграм: <a href={"https://t.me/AntonIvanov1111"}>Ссылка</a></li>
      </ol>
    </div>
  )
}