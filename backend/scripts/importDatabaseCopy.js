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

const OBJECT_ID_FIELDS = new Set([
  '_id',
  'companyID',
  'studentID',
  'programID',
]);

const DATE_FIELDS = new Set([
  'createdAt',
  'updatedAt',
  'appliedDate',
  'dateFrom',
  'dateTo',
  'registrationDeadline',
]);

const toMongoValue = (key, value) => {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map((item) => toMongoValue('', item));
  if (typeof value === 'object') return toMongoDocument(value);
  if (OBJECT_ID_FIELDS.has(key) && mongoose.Types.ObjectId.isValid(value)) {
    return new mongoose.Types.ObjectId(value);
  }
  if (DATE_FIELDS.has(key)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return value;
};

const toMongoDocument = (doc) => {
  const out = {};
  Object.entries(doc).forEach(([key, value]) => {
    out[key] = toMongoValue(key, value);
  });
  return out;
};

const main = async () => {
  if (!process.argv.includes('--yes')) {
    throw new Error('Pass --yes to import and replace database collections.');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set.');
  }

  const inputPath = path.resolve(
    __dirname,
    '../../database/tadreeb-database-copy.json'
  );
  const raw = await fs.readFile(inputPath, 'utf8');
  const backup = JSON.parse(raw);

  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;

  for (const collectionName of COLLECTIONS) {
    const docs = backup.collections?.[collectionName] || [];
    await db.collection(collectionName).deleteMany({});

    if (docs.length > 0) {
      await db.collection(collectionName).insertMany(docs.map(toMongoDocument));
    }
  }

  console.log(`Imported database copy from ${inputPath}`);
};

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
