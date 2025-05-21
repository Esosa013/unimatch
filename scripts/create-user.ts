// // scripts/create-user.ts
// const { MongoClient } = require('mongodb');
// const bcrypt = require('bcryptjs');
// const dotenv = require('dotenv');

// dotenv.config({ path: '.env.local' })
//  // Load env vars like MONGODB_URI

// const uri = process.env.MONGODB_URI || ''
// const client = new MongoClient(uri)

// async function createUser(email: string, password: string, role: 'admin' | 'student') {
//   try {
//     await client.connect()
//     const db = client.db()
//     const users = db.collection('users')

//     const existing = await users.findOne({ email })
//     if (existing) {
//       console.log(`❌ User with email ${email} already exists.`)
//       return
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const result = await users.insertOne({
//       email,
//       password: hashedPassword,
//       role,
//     })

//     console.log(`✅ ${role.toUpperCase()} created: ${email} (ID: ${result.insertedId})`)
//   } catch (err) {
//     console.error('Error creating user:', err)
//   } finally {
//     await client.close()
//   }
// }

// // Usage: node scripts/create-user.js <email> <password> <role>
// const [email, password, role] = process.argv.slice(2)

// if (!email || !password || (role !== 'admin' && role !== 'student')) {
//   console.log('❌ Usage: node scripts/create-user.js <email> <password> <admin|student>')
//   process.exit(1)
// }

// createUser(email, password, role as 'admin' | 'student')
