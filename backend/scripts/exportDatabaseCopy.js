require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');

const COLLECTIONS = [
  'admins',
  'students',
  'companies',
  'companyrequests',
  'opportunities',
  'applications',
];

const serializeValue = (value) => {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(serializeValue);
  if (value && typeof value === 'object') {
    if (value._bsontype === 'ObjectId') return value.toString();
    const out = {};
    Object.entries(value).forEach(([key, nestedValue]) => {
      out[key] = serializeValue(nestedValue);
    });
    return out;
  }
  return value;
};

const main = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set.');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const db = mongoose.connection.db;
  const collections = {};

  for (const collectionName of COLLECTIONS) {
    const documents = await db
      .collection(collectionName)
      .find({})
      .sort({ _id: 1 })
      .toArray();

    collections[collectionName] = documents.map(serializeValue);
  }

  const exportData = {
    database: db.databaseName,
    exportedAt: new Date().toISOString(),
    note:
      'Tadreeb test database copy for course evaluation. Passwords are bcrypt hashes for the documented test accounts.',
    collections,
  };

  const outputDir = path.resolve(__dirname, '../../database');
  const outputPath = path.join(outputDir, 'tadreeb-database-copy.json');

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(exportData, null, 2)}\n`);

  console.log(`Exported database copy to ${outputPath}`);
};

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
