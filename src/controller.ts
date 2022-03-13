import { Log, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export const controller = {
    async lastLog() {

    },
    async previousLog(currentId: string): Promise<Log | null> {
        return prisma.log.findFirst({
            where: {
                NOT: {
                    id: currentId
                }
            },
            orderBy: {
                date: 'desc'
            }
        })
    },
    async listLogs(telegramId: string) {
        const userId = await this.userIdByTelegramId(telegramId);
        if (userId) {
            return prisma.log.findMany({
                where: {
                    userId
                },
                select: {
                    id: true,
                    date: true,
                    log: true
                }
            });
        }
    },
    async userIdByTelegramId(telegramId: string): Promise<string | undefined> {
        const user = await prisma.user.findUnique({
            where: {
                telegramId
            },
            select: {
                id: true
            }
        });
        return user?.id;
    },
    async saveLog(telegramId: string, name: string, logText: string, createdAt: Date): Promise<Log> {
        const userId = await this.registerUser(telegramId, name);
        return await prisma.log.create({
            data: {
                log: logText,
                date: createdAt,
                userId
            }
        })
    },
    async registerUser(telegramId: string, name: string): Promise<string> {
        const userId = await this.userIdByTelegramId(telegramId);
        if (userId)
            return userId;

        const { id } = await prisma.user.create({
            data: {
                telegramId,
                name,
                registeredAt: new Date()
            },
            select: {
                id: true
            }
        });
        return id;
    }
}