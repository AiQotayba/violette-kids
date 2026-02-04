import Cookies from "js-cookie"
import type { Admin } from "./types"

const TOKEN_KEY = "kids_library_token"
const USER_KEY = "kids_library_user"

export const auth = {
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, { 
      expires: 7, 
      path: "/",
      sameSite: "strict"
    })
  },

  getToken: (): string | null => {
    if (typeof window === "undefined") return null
    return Cookies.get(TOKEN_KEY) || null
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY, { path: "/" })
  },

  setUser: (user: Admin) => {
    Cookies.set(USER_KEY, JSON.stringify(user), { 
      expires: 7, 
      path: "/",
      sameSite: "strict"
    })
  },

  getUser: (): Admin | null => {
    if (typeof window === "undefined") return null
    const userStr = Cookies.get(USER_KEY)
    if (!userStr) return null
    try {
      return JSON.parse(userStr) as Admin
    } catch {
      return null
    }
  },

  removeUser: () => {
    Cookies.remove(USER_KEY, { path: "/" })
  },

  login: (token: string, user: Admin) => {
    auth.setToken(token)
    auth.setUser(user)
  },

  logout: () => {
    auth.removeToken()
    auth.removeUser()
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  },

  isAuthenticated: (): boolean => {
    return !!auth.getToken()
  }
}
