// scripts/create-users.ts

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

const names: [string, string][] = [
  ['john', 'doe'], ['jane', 'smith'], ['emma', 'okafor'], ['michael', 'adebayo'],
  ['grace', 'uche'], ['daniel', 'etim'], ['chinedu', 'ezekwe'], ['nkechi', 'obi'],
  ['femi', 'oladipo'], ['amaka', 'okonkwo'], ['david', 'johnson'], ['miriam', 'akpan'],
  ['victor', 'igwe'], ['peace', 'nwankwo'], ['samuel', 'ogundipe'], ['linda', 'ebere'],
  ['raphael', 'uche'], ['ruth', 'onuoha'], ['benson', 'akande'], ['susan', 'uduak'],
  ['isaac', 'nduka'], ['patricia', 'ogbonna'], ['chika', 'nwosu'], ['evelyn', 'ajayi'],
  ['philip', 'anene'], ['blessing', 'chukwu'], ['nathan', 'abiodun'], ['joy', 'mbakwe'],
  ['timothy', 'ibrahim'], ['gloria', 'salami'], ['henry', 'okon'], ['rose', 'eze'],
  ['paul', 'udo'], ['miracle', 'onye'], ['ifeanyi', 'orji'], ['stephanie', 'balogun'],
  ['tope', 'adewale'], ['doris', 'uche'], ['kingsley', 'okoro'], ['uchechi', 'nwachukwu'],
];

interface Student {
  email: string;
  password: string;
  role: 'student';
}

const students: Student[] = names.map(([first, last], i) => ({
  email: `${first}.${last}@binghamuni.edu.ng`,
  password: `Password${i + 1}$`,
  role: 'student',
}));

async function createUsers(users: Student[]) {
  try {
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection('users');

    for (const user of users) {
      const existing = await usersCollection.findOne({ email: user.email });
      if (existing) {
        console.log(`❌ Skipping existing user: ${user.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const result = await usersCollection.insertOne({
        email: user.email,
        password: hashedPassword,
        role: user.role,
      });

      console.log(`✅ Created: ${user.email} (ID: ${result.insertedId})`);
    }
  } catch (err) {
    console.error('❌ Error creating users:', err);
  } finally {
    await client.close();
  }
}

createUsers(students);
