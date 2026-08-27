import bcrypt from 'bcryptjs';

const hashPassword = async (password) => {
  return await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
};

export default hashPassword;
