import { DB, prismaErrHandler } from '@/libs/prisma';
import { MessageArguments, QueryArguments, UserDataType, ConversationsData } from '@/type/types';

const filter = (data: ConversationsData[], username: string): ConversationsData[] => {
    return data.map(obj => {
        // Create a new partial object of type ConversationsData to store filtered properties.
        const filteredObj: Partial<ConversationsData> = {};
        Object.keys(obj).forEach(key => {
            // If the value of the current property is not equal to the username, add it to the filtered object.
            if (obj[key as keyof ConversationsData] !== username) {
                filteredObj[key as keyof ConversationsData] = obj[key as keyof ConversationsData];
                if (['initiatorId', 'recipientId'].includes(key)) {
                    filteredObj['username'] = filteredObj[key]
                    delete filteredObj[key]
                }
            }
        });
        // Return the filtered object, casting it back to ConversationsData type.
        return filteredObj as ConversationsData;
    });
}
export const getUserPassword = async (username: string): Promise<{password: string}> => {
    try {
        return await DB.users.findFirst({
            where: {
                username: {
                    equals: username
                }
            },
            select: {
                password: true
            }
        })
    } catch (error: unknown) {
        prismaErrHandler(error)
    }
}
export const getProfileById = async (args: QueryArguments): Promise<object | undefined> => {
    try {
        return await DB.users.findFirst({
            where: {
                username: { equals: args.username }
            },
            omit: {
                password: true
            }
        })
    } catch (error: unknown) {
        prismaErrHandler(error)
    }
}
export const getAllMessages = async (args: QueryArguments): Promise<object | undefined> => {
    try {
        return await DB.message.findMany({
            where: {
                cid: { equals: args.cid }
            },
            orderBy: {
                timestamp: args.sort
            }
        })
    } catch (error: unknown) {
        prismaErrHandler(error)
    }
}
export const getAllConversations = async (args: QueryArguments): Promise<object | undefined> => {
    try {
        const _list = await DB.conversation.findMany({
            where: {
                OR: [
                    { recipientId: { equals: args.username } },
                    { initiatorId: { equals: args.username } }
                ]
            }
        });
        return filter(_list, args.username)
    } catch (error: unknown) {
        prismaErrHandler(error)
    }
}
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
export const storeConversation = async (body: MessageArguments ): Promise<{cid: string, text: string}> => {
    try {
        return await DB.$transaction(async (model) => {
            let currentId: string = null
            // first we need to check if the user has already participate in a conversation
            // if exist we use the ID to continue using the broker queue
            const getCid = await model.conversation.findFirst({
                where: {
                    OR: [
                        {
                            AND: [
                                { initiatorId: body.senderId },
                                { recipientId: body.to }
                            ]
                        },
                        {
                            AND: [
                                { initiatorId: body.to },
                                { recipientId: body.senderId }
                            ]
                        },
                    ]
                },
                select: {
                    id: true
                }
            });
            if (!getCid) {
                // storing the conversation data into model
                const result = await model.conversation.create({
                    data: {
                         initiatorId: body.senderId,
                         recipientId: body.to
                    },
                    select: {
                        id: true
                    }
                })
                currentId = result.id
            }
            return await model.message.create({
                data: {
                    cid: currentId || getCid.id,
                    text: body.text,
                    senderId: body.senderId
                },
                select: {
                    cid: true,
                    text: true
                }
            })
        })
    } catch (error: unknown) {
        prismaErrHandler(error)
    }
}