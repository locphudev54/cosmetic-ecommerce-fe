import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_BACKEND_API_URL: z.url('Invalid NEXT_PUBLIC_BACKEND_API_URL'),
  NEXT_PUBLIC_API_URL: z.url('Invalid NEXT_PUBLIC_API_URL'),
  NEXT_PUBLIC_LOGOUT_SECRET_KEY: z.string().min(1, 'NEXT_PUBLIC_LOGOUT_SECRET_KEY is required')
})

// Validate and export
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_LOGOUT_SECRET_KEY: process.env.NEXT_PUBLIC_LOGOUT_SECRET_KEY
})

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

export const envClient = parsed.data
