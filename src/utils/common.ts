import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};


export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
