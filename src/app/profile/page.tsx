"use client"
import {useEffect, useState} from "react";
import { redirect } from 'next/navigation'
import {AUTH_API} from "@/components/constants";
import {red} from "next/dist/lib/picocolors";

export default function ProfilePage() {
    const [token, setToken] = useState<string|null>("");
    const [profileData, setProfileData] = useState<User|null>(null);


    useEffect(() => {
        if (token === ""){
            setToken(localStorage.getItem("mti_auth_key"))
        }
    }, []);

    useEffect(() => {
        if (token === null){
            redirect("/login")
        }
        if (token !== ""){
            console.log("Token", token);
            fetch(
                AUTH_API + "check_auth", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            ).then(res => {
                if (res.status == 401){
                    localStorage.removeItem("mti_auth_key")
                    redirect('/login')
                }
                return res.json()
            }).then(data => {
                setProfileData(data)
            })
        }
    }, [token]);

    return  (
        <div>
            <h1>{profileData?.username}</h1>
        </div>
    )
}