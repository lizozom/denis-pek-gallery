const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-password-hash.js <password>');
  process.exit(1);
}

const saltRounds = 10;
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }

  // Encode the hash in base64 to avoid issues with $ characters in env vars
  const base64Hash = Buffer.from(hash).toString('base64');

  console.log('\nPassword hash generated successfully!');
  console.log('\nOriginal hash:', hash);
  console.log('\nAdd this to your .env.local file:');
  console.log(`ADMIN_PASSWORD_HASH=${base64Hash}\n`);
  console.log('(Hash is base64 encoded to avoid $ character issues in environment variables)');
});
