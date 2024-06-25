import { DB, prismaErrHandler } from '@/libs/prisma';
import { UserDataType, UserLoginType } from '@/type/types';

export const userRegister = async (body: UserDataType): Promise<object | undefined> => {
    try {
        return await DB.users.create({
            data: {...body},
            omit: {
                password: true
            }
        })
    } catch (error: unknown) {
        prismaErrHandler(error)
    }
}
export const userLogin = async (body: UserLoginType): Promise<void> => {

}