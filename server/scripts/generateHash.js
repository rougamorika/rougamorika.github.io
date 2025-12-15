// Temporary script to generate bcrypt hash for initial admin password
import bcrypt from 'bcrypt';

const password = 'admin123';
const saltRounds = 10;

try {
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Password:', password);
  console.log('Hash:', hash);
} catch (err) {
  console.error('Error generating hash:', err);
}
