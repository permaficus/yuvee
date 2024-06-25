import { httpServer, serverInit } from "@/libs/service";

const main = async (): Promise<void> => {
    await serverInit();
    await new Promise<void>((resolve) => httpServer.listen({ port: 4100 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4100/`);
}
main();