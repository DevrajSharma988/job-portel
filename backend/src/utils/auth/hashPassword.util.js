import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  return await bcrypt.hash(password, saltRounds);
};

export default hashPassword;
