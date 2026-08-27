import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
};

export default hashPassword;
