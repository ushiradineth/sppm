import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { type GetServerSidePropsContext } from "next";

import { prisma } from "./db";

type UserRoles = "Admin" | "User";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRoles;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return Promise.resolve(token);
    },
    session({ session, token }) {
      if (token.user) {
        const t = token.user as {
          id: string;
          role: UserRoles;
        };

        session.user = {
          id: t.id,
          email: token.email,
          image: token.picture,
          name: token.name,
          role: t.role,
        };
      }
      return Promise.resolve(session);
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user) {
          const userVerified = bcrypt.compareSync(credentials?.password ?? "", user.password);

          if (userVerified) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: "User",
            };
          }
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials?.email },
        });

        if (admin) {
          const adminVerified = bcrypt.compareSync(credentials?.password ?? "", admin.password);

          if (adminVerified) {
            return {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: "Admin",
            };
          }
        }

        return null;
      },
    }),
  ],
};

export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext["req"]; res: GetServerSidePropsContext["res"] }) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
