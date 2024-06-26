import { getAllConversations, getAllMessages, getProfileById } from "@/model";
import { ConversationsData, QueryArguments } from "@/type/types";

const filter = (data: ConversationsData[], username: string): ConversationsData[] => {
    return data.map(obj => {
        // Create a new partial object of type ConversationsData to store filtered properties.
        const filteredObj: Partial<ConversationsData> = {};
        Object.keys(obj).forEach(key => {
            // If the value of the current property is not equal to the username, add it to the filtered object.
            if (obj[key as keyof ConversationsData] !== username) {
                filteredObj[key as keyof ConversationsData] = obj[key as keyof ConversationsData];
            }
        });
        // Return the filtered object, casting it back to ConversationsData type.
        return filteredObj as ConversationsData;
    });
}
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
    const conversationList = await getAllConversations({
        ...args
    })
    // @ts-expect-error
    return filter(conversationList, args.username)
}