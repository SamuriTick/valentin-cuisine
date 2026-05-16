import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function createAdminUser(email: string, password: string, name?: string) {
  const hashedPassword = await bcrypt.hash(password, 12)
  
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || 'Admin',
        role: 'admin',
        active: true
      }
    })
    
    console.log('Admin user created:', { id: user.id, email: user.email, name: user.name })
    return user
  } catch (error) {
    console.error('Error creating admin user:', error)
    throw error
  }
}

async function main() {
  const email = process.env.ADMIN_EMAIL || 'valentin@valentincuisine.com'
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || 'Valentin'

  if (!password) {
    console.error('Set ADMIN_PASSWORD env var before running this script.')
    process.exit(1)
  }

  const existingUser = await prisma.user.findFirst({ where: { email } })
  if (existingUser) {
    console.log('Admin user already exists:', { id: existingUser.id, email: existingUser.email })
    return
  }

  await createAdminUser(email, password, name)
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}