import { hashedPassword } from "@/libs/bcrypt";
import { storeConversation, userRegister } from "@/model";
import { MessageArguments, UserDataType } from "@/type/types";

export const storingMessages = async (args: MessageArguments): Promise<{cid: string, text: string}> => {
    return await storeConversation({
        senderId: args.from,
        ...args
    });
}
export const registerUser = async (args: UserDataType): Promise<object | undefined> => {
    // hashing the password
    args.password = await hashedPassword(args.password)
    return await userRegister({
        ...args
    })
}