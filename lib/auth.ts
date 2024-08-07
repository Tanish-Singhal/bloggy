import prisma from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";
import { z } from "zod";

const credentialSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 6 characters long"),
});

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "",
        },
      },

      async authorize(credentials: any) {
        const result = credentialSchema.safeParse(credentials);
        if (!result.success) {
          console.error(result.error);
          return null;
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            email: result.data.email,
          },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            result.data.password,
            existingUser.password
          );

          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              username: existingUser.username,
              email: existingUser.email,
            };
          }
        }
        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin"
  }
};
