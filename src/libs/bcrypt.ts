import { GEN_SALT } from '@/constant/config';
import bcrypt from 'bcryptjs';

export const hashedPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, +GEN_SALT)
}
export const isPasswordMatch = async (password: string, hashedPassword): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);

}