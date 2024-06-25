import { RabbitInstance, DEFAULT_EXCHANGE, MESSAGE_BROKER_SERVICE } from "@/libs/amqp";
import { MessageArguments } from "@/type/types";
import chalk from "chalk";

export const sendText = async (
    args: MessageArguments
): Promise<void> => {
    const headers = {
        reply_to: args.from,
        token: args.token
    }
    const rbmq = new RabbitInstance();
    rbmq.connect();
    rbmq.on('connected', async (EventListener) => {
        const { channel, conn } = EventListener;
        const targetQueue = args.queue;
        const targetRoutingKey = args.routingKey;
        const exchange = await rbmq.initiateExchange({
            name: DEFAULT_EXCHANGE,
            type: `topic`,
            durable: true,
            autoDelete: false,
            internal: false,
            channel: channel
        });
        rbmq.createQueue({
            name: targetQueue,
            channel: channel,
            options: {
                durable: true,
                arguments: { 
                    'x-queue-type': 'classic', 
                    'x-dead-letter-exchange': DEFAULT_EXCHANGE
                }
            }
        });
        await channel.bindQueue(targetQueue, exchange, targetRoutingKey);
        await channel.publish(exchange, targetRoutingKey, Buffer.from(JSON.stringify(args.message)), { headers: headers });
        rbmq.setClosingState(true);
        await channel.close();
        await conn.close();
    });
    rbmq.on('error', error => {
        console.info(chalk.red(`[RBMQ] Error: ${error.message}`));
    })
    rbmq.on('reconnect', attempt => {
        console.info(`[RBMQ] Retrying connect to: ${chalk.yellow(MESSAGE_BROKER_SERVICE.split('#')[0])}, attempt: ${chalk.green(attempt)}`);
    })
    rbmq.on('ECONNREFUSED', () => {
        console.error(chalk.red(`[RBMQ] Connection to ${MESSAGE_BROKER_SERVICE.split('#')[0]} refused`))
        return;
    })
    rbmq.on('access_refused', error => {
        console.info(chalk.red(`[RBMQ] Error: ${error.message}`));
    })
}