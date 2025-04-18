export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  API_URL: process.env.API_URL || 'http://localhost:3001'
}
