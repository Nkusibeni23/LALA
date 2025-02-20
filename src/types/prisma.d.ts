import { Prisma } from "@prisma/client";

declare global {
  namespace PrismaJson {
    type NotificationCreateInput = {
      userId: string;
      message: string;
      type: string;
      bookingId?: string;
      data?: Prisma.JsonValue;
    };
  }
}

declare module "@prisma/client" {
  interface PrismaClient {
    notification: {
      create: (args: {
        data: PrismaJson.NotificationCreateInput;
      }) => Promise<any>;
      findMany: (args?: { where?: any; orderBy?: any }) => Promise<any[]>;
    };
  }
}
