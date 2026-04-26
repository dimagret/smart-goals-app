import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getAuthSession() {
  return await getServerSession(authOptions)
}

export async function requireAuth() {
  const session = await getAuthSession()
  
  if (!session?.user?.id) {
    return null
  }
  
  return session
}