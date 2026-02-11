import { z } from 'zod'

// Server-side variables
const envSchema = z.object({
  BACKEND_API_URL: z.url('Invalid BACKEND_API_URL'),
  API_URL: z.url('Invalid API_URL'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  LOGOUT_SECRET_KEY: z.string().min(1, 'LOGOUT_SECRET_KEY is required')
})

// Validate and export
const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

export const envServer = parsed.data
