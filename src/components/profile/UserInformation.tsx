"use client"
import { Forms } from "../forms/index.parts"
import { User } from "@/types/UsersApi"
import { Button } from "@/components/ui/Buttons"
import { useEffect, useState } from "react"
import { Form } from "@base-ui-components/react"
import { useEditUserMutation } from "@/api/users/clientApiInterface"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useRouter } from "next/navigation"

export default ({ isEditing, user, refetch }: { isEditing: boolean; user: User; refetch: () => void }) => {
  const [isEdit, setIsEditing] = useState(isEditing)
  const [editUser, { data, isSuccess, isLoading, reset }] = useEditUserMutation()
  const token = useAppSelector((state) => state.auth.token)
  const router = useRouter()

  useEffect(() => {
    setIsEditing(false)
    if (isSuccess) {
      reset()
      refetch()
    }
  }, [isSuccess])
  return (
    <>
      <Forms.Root isEdit={isEdit} isExpanded={false}>
        <Forms.Trigger
          onConfirm={(e) => {
            const first = e.get("firstName")
            const second = e.get("secondName")
            const third = e.get("thirdName")
            editUser({
              token: token,
              firstName: typeof first === "string" ? first : "",
              secondName: typeof second === "string" ? second : "",
              thirdName: typeof third === "string" ? third : "",
            })
          }}
        >
          <Forms.EdiatableItems>
            <div className="flex flex-col gap-2">
              <div className="border-border bg-bg-main-accent relative h-15 w-full rounded-md border">
                <p className="text-text-alt absolute h-4 px-2 pt-1 text-[13px]">Фамилия</p>
                <Forms.InputField
                  className="placeholder:text-text-main size-full h-full px-2 pt-4 leading-11 font-bold"
                  type={"text"}
                  name={"firstName"}
                  defaultValue={user.firstName}
                  // placeholder={fieldObject?.metadata?.placeholder ?? fieldObject.title}
                  onVerification={(value: string) => {
                    return {
                      isSuccess: true,
                    }
                  }}
                />
              </div>
              <div className="border-border bg-bg-main-accent relative h-15 w-full rounded-md border">
                <p className="text-text-alt absolute h-4 px-2 pt-1 text-[13px]">Имя</p>
                <Forms.InputField
                  className="placeholder:text-text-main size-full h-full px-2 pt-4 leading-11 font-bold"
                  type={"text"}
                  name={"secondName"}
                  defaultValue={user.secondName}
                  // placeholder={fieldObject?.metadata?.placeholder ?? fieldObject.title}
                  onVerification={(value: string) => {
                    return {
                      isSuccess: true,
                    }
                  }}
                />
              </div>
              <div className="border-border bg-bg-main-accent relative h-15 w-full rounded-md border">
                <p className="text-text-alt absolute h-4 px-2 pt-1 text-[13px]">Отчество</p>
                <Forms.InputField
                  className="placeholder:text-text-main size-full h-full px-2 pt-4 leading-11 font-bold"
                  type={"text"}
                  name={"thirdName"}
                  defaultValue={user.thirdName}
                  // placeholder={fieldObject?.metadata?.placeholder ?? fieldObject.title}
                  onVerification={(value: string) => {
                    return {
                      isSuccess: true,
                    }
                  }}
                />
              </div>
            </div>
            <Forms.ConfirmButton className="bg-accent-primary/20 border-accent-primary hover:bg-accent-primary/50 text-accent-primary mt-2 w-full rounded-xl border px-4 py-2">
              Сохранить
            </Forms.ConfirmButton>
            {/*<Button type="submit" className={"bg-accent-primary/20 border border-accent-primary hover:bg-accent-primary/50 text-accent-primary px-4 py-2 mt-2 rounded-xl w-full"}>Сохранить</Button>*/}
          </Forms.EdiatableItems>
          <Forms.DefaultItems>
            <div className="flex flex-col gap-2">
              <div className="border-border flex w-full flex-col rounded-xl border px-4 py-2">
                <span className="text-text-main text-[0.8rem] font-bold">Фамилия</span>
                <p className="flex-3">{user.firstName}</p>
              </div>
              <div className="border-border flex w-full flex-col rounded-xl border px-4 py-2">
                <span className="text-text-main text-[0.8rem] font-bold">Имя</span>
                <p className="flex-3">{user.secondName}</p>
              </div>
              <div className="border-border flex w-full flex-col rounded-xl border px-4 py-2">
                <span className="text-text-main text-[0.8rem] font-bold">Отчество</span>
                <p className="flex-3">{user.thirdName}</p>
              </div>
            </div>
            <Button
              className={
                "bg-accent-primary/20 border-accent-primary hover:bg-accent-primary/50 text-accent-primary mt-2 w-full rounded-xl border px-4 py-2"
              }
              onClick={() => {
                setIsEditing(true)
              }}
            >
              Редактировать
            </Button>
          </Forms.DefaultItems>
        </Forms.Trigger>
      </Forms.Root>
    </>
  )
}
