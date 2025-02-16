import { User as PrismaUser } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "RENTER" | "HOST";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    password?: string;
    emailVerified?: Date | null;
    image?: string | null;
    role: "RENTER" | "HOST";
  }
}
