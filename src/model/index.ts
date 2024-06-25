import { DB, prismaErrHandler } from '@/libs/prisma';
import { MessageArguments, QueryArguments, UserDataType, UserLoginType } from '@/type/types';

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
        return await DB.conversation.findMany({
            where: {
                OR: [
                    { recipientId: { equals: args.username } },
                    { initiatorId: { equals: args.username } }
                ]
            }
        })
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
export const storeConversation = async (body: MessageArguments ): Promise<any> => {
    try {
        return await DB.$transaction(async (model) => {
            let currentId: string = null
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
                // storing conversation
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