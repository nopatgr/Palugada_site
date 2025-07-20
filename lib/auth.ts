import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode("your-super-secret-jwt-key-change-in-production")
const JWT_ALGORITHM = "HS256"

export interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin"
}

// In production, store this in a secure database
const ADMIN_CREDENTIALS = {
  email: "admin@digitalpro.com",
  password: "admin123!", // In production, use hashed passwords
  name: "Admin User",
  id: "admin-1",
}

export const authService = {
  // Authenticate admin credentials
  authenticate: async (email: string, password: string): Promise<AdminUser | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      return {
        id: ADMIN_CREDENTIALS.id,
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: "admin",
      }
    }
    return null
  },

  // Generate JWT token
  generateToken: async (user: AdminUser): Promise<string> => {
    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET)

    return token
  },

  // Verify JWT token
  verifyToken: async (token: string): Promise<AdminUser | null> => {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      return {
        id: payload.sub as string,
        email: payload.email as string,
        name: payload.name as string,
        role: payload.role as "admin",
      }
    } catch (error) {
      return null
    }
  },

  // Store token in localStorage
  storeToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_token", token)
    }
  },

  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_token")
    }
    return null
  },

  // Remove token from localStorage
  removeToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token")
    }
  },
}
