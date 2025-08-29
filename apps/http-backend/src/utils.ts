import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(
    parseInt(process.env.SALT_ROUNDS as string)
  );
  return bcrypt.hash(password, salt);
}
