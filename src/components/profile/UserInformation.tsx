"use client"
import { Forms } from "../forms/index.parts";
import {User} from "@/types/UsersApi";
import {Button} from "@/components/ui/Buttons";
import {useState} from "react";
import {Form} from "@base-ui-components/react";

export default function UserInformation(
  {isEditing, user}: {isEditing: boolean, user: User}
){
  const [isEdit, setIsEditing] = useState(isEditing);
  return (
    <>
      <Forms.Root isEdit={isEdit} isExpanded={false}>
          <Forms.Trigger onConfirm={(e)=>console.log("confirm", e.entries().toArray())}>
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
                      name={"firstName"}
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
                      name={"firstName"}
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

                <Button className={"bg-accent-primary/20 border border-accent-primary hover:bg-accent-primary/50 text-accent-primary px-4 py-2 mt-2 rounded-xl w-full"} onClick={()=>{setIsEditing(false)}}>Сохранить</Button>
              </Forms.EdiatableItems>
              <Forms.DefaultItems>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col w-full border border-border px-4 py-2 rounded-xl">
                    <span className="text-[0.8rem] font-bold text-text-main ">Фамилия</span>
                    <p className="flex-3">{user.firstName}</p>
                  </div>
                  <div className="flex flex-col w-full border border-border px-4 py-2 rounded-xl">
                    <span className="text-[0.8rem] font-bold text-text-main ">Имя</span>
                    <p className="flex-3">{user.secondName}</p>
                  </div>
                  <div className="flex flex-col w-full border border-border px-4 py-2 rounded-xl">
                    <span className="text-[0.8rem] font-bold text-text-main ">Отчество</span>
                    <p className="flex-3">{user.thirdName}</p>
                  </div>
                </div>
                <Button className={"bg-accent-primary/20 border border-accent-primary hover:bg-accent-primary/50 text-accent-primary px-4 py-2 mt-2 rounded-xl w-full"} onClick={()=>{setIsEditing(true)}}>Редактировать</Button>
              </Forms.DefaultItems>
          </Forms.Trigger>
      </Forms.Root>

    </>
  )
}