const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const path = require('path')
const dotenv = require('dotenv')

// Load the correct .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.prod' 
  : process.env.NODE_ENV === 'staging' 
    ? '.env.staging' 
    : '.env'

dotenv.config({ path: path.resolve(process.cwd(), envFile) })

console.log('Initializing database connections...')

// Development database (source)
const devDatabaseUrl = "mysql://u142693994_Hillsridedb01:HillsRide12345678910111213141516171819202122@srv1115.hstgr.io/u142693994_Hillsridedb01?connection_limit=5&pool_timeout=10&connection_timeout=60"

console.log('Creating source client...')
const sourceClient = new PrismaClient({
  datasources: {
    db: {
      url: devDatabaseUrl
    }
  }
})

console.log('Creating target client...')
const targetClient = new PrismaClient()

async function main() {
  try {
    console.log('Starting seed...')
    
    // First, let's check what databases we can access
    console.log('Checking available databases...')
    const databases = await sourceClient.$queryRaw`SHOW DATABASES`
    console.log('Available databases:', databases)

    // Then check current database
    const currentDB = await sourceClient.$queryRaw`SELECT DATABASE()`
    console.log('Current database:', currentDB)

    // Check all tables in the current database
    console.log('Checking all tables in current database...')
    const tables = await sourceClient.$queryRaw`SHOW TABLES`
    console.log('Available tables:', tables)

    // If we get here, we'll try to query the users table directly
    console.log('Attempting to query users table...')
    const userCount = await sourceClient.$queryRaw`SELECT COUNT(*) as count FROM users`
    console.log('User count:', userCount)

    // Get existing data with error handling
    let existingUsers = []
    try {
      // Try direct table query first
      existingUsers = await sourceClient.$queryRaw`SELECT * FROM users`
      console.log(`Found ${existingUsers.length} users using raw query`)
    } catch (error) {
      console.error('Error fetching users with raw query:', error)
      try {
        // Fallback to Prisma query
        existingUsers = await sourceClient.user.findMany()
        console.log(`Found ${existingUsers.length} users using Prisma query`)
      } catch (error) {
        console.error('Error fetching users with Prisma query:', error)
        throw error
      }
    }

    let existingLocations = []
    try {
      existingLocations = await sourceClient.location.findMany()
      console.log(`Found ${existingLocations.length} locations`)
    } catch (error) {
      console.error('Error fetching locations:', error)
      throw error
    }

    let existingRoutes = []
    try {
      existingRoutes = await sourceClient.route.findMany()
      console.log(`Found ${existingRoutes.length} routes`)
    } catch (error) {
      console.error('Error fetching routes:', error)
      throw error
    }

    const existingStops = await sourceClient.stop.findMany()
    console.log(`Found ${existingStops.length} stops`)

    const existingRouteFares = await sourceClient.routeFare.findMany()
    console.log(`Found ${existingRouteFares.length} route fares`)

    const existingRouteAvailability = await sourceClient.routeAvailability.findMany()
    console.log(`Found ${existingRouteAvailability.length} route availability`)

    console.log('Starting to seed target database...')

    // Seed users
    console.log('Seeding users...')
    for (const user of existingUsers) {
      await targetClient.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          ...user,
          id: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          password: user.password ? await bcrypt.hash(user.password, 10) : undefined
        }
      })
    }

    // Seed locations
    console.log('Seeding locations...')
    for (const location of existingLocations) {
      await targetClient.location.upsert({
        where: { id: location.id },
        update: {},
        create: {
          ...location,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    // Seed routes
    console.log('Seeding routes...')
    for (const route of existingRoutes) {
      await targetClient.route.upsert({
        where: { id: route.id },
        update: {},
        create: {
          ...route,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    // Seed stops
    for (const stop of existingStops) {
      await targetClient.stop.upsert({
        where: { id: stop.id },
        update: {},
        create: {
          ...stop,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    // Seed route fares
    for (const fare of existingRouteFares) {
      await targetClient.routeFare.upsert({
        where: { id: fare.id },
        update: {},
        create: {
          ...fare,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    // Seed route availability
    for (const availability of existingRouteAvailability) {
      await targetClient.routeAvailability.upsert({
        where: { id: availability.id },
        update: {},
        create: {
          ...availability,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    console.log('Seed completed successfully')
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    })
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('Disconnecting clients...')
    await sourceClient.$disconnect()
    await targetClient.$disconnect()
    console.log('Clients disconnected')
  })