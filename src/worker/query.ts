import { getAllConversations, getAllMessages, getProfileById } from "@/model";
import { QueryArguments } from "@/type/types";

export const fetchUserProfile = async (args: QueryArguments): Promise<object | undefined> => {
    return await getProfileById({
        ...args
    })
}
export const fetchAllMessages = async (args: QueryArguments): Promise<object | undefined> => {
    return await getAllMessages({
        ...args
    })
}
export const fetchAllConversations = async (args: QueryArguments): Promise<object | undefined> => {
    return await getAllConversations({
        ...args
    })
}