import { httpServer, serverInit } from "@/libs/service";
import { LOCAL_SERVICE_PORT, NODE_ENV } from "@/constant/config";
import chalk from 'chalk';

const main = async (portNumber: number): Promise<void> => {
    await serverInit();
    await new Promise<void>(
        (resolve) => 
            httpServer.listen({ port: portNumber }, resolve)
            .on('listening', () => {
                console.log(
                    `-----------------------------------------
                    \n${chalk.black.bgGreenBright(`🚀 GraphQL Service is Up and Running\n`
                    )}\nMode: ${chalk.blueBright(
                      `${NODE_ENV}`
                    )}\nURL: ${chalk.blueBright(
                      `http://localhost:${portNumber}`
                    )}\nTime: ${chalk.blueBright(
                        `${new Date(Date.now())}`
                    )}\n\n-----------------------------------------`
                  );
            })
            .on('error', (error: any) => {
                if (error.code === 'EADDRINUSE') {
                    console.error(`${chalk.green('[http-server]')} ${chalk.redBright(`Port ${portNumber} already in use`)}.`);
                    return;
                }
            })
    );
}
main(+LOCAL_SERVICE_PORT);