"use client"

import {useAppDispatch, useAppSelector} from "@/redux_stores/tournamentTypeRedixStore";
import {useEffect} from "react";
import {fetchPermissions} from "@/scripts/ApiFetchers";
import {setAuth} from "@/redux_stores/AuthSlice";

export default function AuthReduxUpdator() {
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.auth.token)
  useEffect(() => {
    console.log("UPDATE TOKEN")
    const getUser = async () => {
      console.log("FETCH PERMISSIONS")
      const user = await fetchPermissions(token)
      dispatch(setAuth(user))
    }
    getUser()
  }, [token]);

  return <></>
}