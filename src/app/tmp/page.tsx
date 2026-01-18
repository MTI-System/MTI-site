"use client"
import {useVerifyEmailQuery} from "@/api/users/clientApiInterface";
import UsersProviderWrapper from "@/api/users/ClientWrapper";
import {useEffect, useState} from "react";

export default function TMPSocket() {

  return (
    <>
      <h1> Здесь тестируется сокет, сорян</h1>
      <UsersProviderWrapper>
        <SocketComponent/>
      </UsersProviderWrapper>

    </>
  )
}

function SocketComponent() {

  const [emails, setEmails] = useState<{ [key: string]: number }>({
    "antonivanov@mtiyt.ru": 0,
    "test1@mtiyt.ru": 0,
  })


  const emailsList = Object.keys(emails)
  const emailsToVerify = emailsList.filter((email) => emails[email] === 0)
  const nextEmailToConfirm = emailsToVerify.length !== 0 ? emailsToVerify[0] : emailsList[emailsList.length - 1]
  const [allMessages, setAllMessages] = useState("")
  const {
    data: verifyEmail,
    isLoading: isVerifyLoading,
    error: verifyError,
    isSuccess: isVerifySuccess,
  } = useVerifyEmailQuery({email: nextEmailToConfirm})

  useEffect(() => {
    if (!verifyEmail){
      console.log("Empty state from socket")
    }
    else if (verifyEmail.startsWith("registered")){
      console.log("Session opened")
    }
    else if (verifyEmail.startsWith("ok")) {
      const email = verifyEmail.split(" ")[1]
      const newEmails = {...emails}
      newEmails[email] = 1
      setEmails(newEmails)
    }
    else if(emailsList.find((e) => e === verifyEmail)){
      const email = verifyEmail
      const newEmails = {...emails}
      newEmails[email] = 2
      setEmails(newEmails)
    }
    else{
      console.log("Unknown message " + verifyEmail)
    }

    setAllMessages(prev => prev + " | " + verifyEmail)
  }, [verifyEmail])

  return (
    <>
      <p>
        Здесь живет соединение
      </p>
      <p>
        {allMessages}
      </p>
      <p>
        {JSON.stringify(emails)}
      </p>
    </>

  )
}