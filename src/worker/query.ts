import { hashedPassword, isPasswordMatch } from "@/libs/bcrypt";
import { getAllConversations, getAllMessages, getProfileById, getUserPassword } from "@/model";
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
const getCurrentPassword = async (username: string): Promise<string> => {
    const { password } = await getUserPassword(username);
    return password
}
export const userLogin = async (_: undefined, args: { body: { username: string, password: string }}, context: object): Promise<string> => {
    const currentPass = await getCurrentPassword(args.body.username);
    const passwordMatched = await isPasswordMatch(args.body.password, currentPass)
    if (passwordMatched) {
        // create token
        return `Success`
    } else {
        throw new Error(`Login Failed: Username or Password didn't match`)
    }
}