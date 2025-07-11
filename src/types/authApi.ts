export interface User {
  id: number
  username: string
  email: string
  rights: Right[]
}

export interface Right{
  id: number
  right_title: string
  right_flag: string
}