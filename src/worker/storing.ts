import { storeConversation, userRegister } from "@/model";
import { MessageArguments, UserDataType } from "@/type/types";

export const storingMessages = async (args: MessageArguments): Promise<{cid: string, text: string}> => {
    return await storeConversation({
        senderId: args.from,
        ...args
    });
}
export const registerUser = async (args: UserDataType): Promise<object | undefined> => {
    return await userRegister({
        ...args
    })
}