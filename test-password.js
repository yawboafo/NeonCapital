const bcrypt = require('bcryptjs');

const password = 'Katherine.Browne1980';
const hash = '$2b$10$tQixutoIe9u.MzHWEJ9Z7.3Kkodw5nQdroGq5IehGB1IkYNphvm92';

bcrypt.compare(password, hash).then(result => {
  console.log('Password matches:', result);
  process.exit(result ? 0 : 1);
});
