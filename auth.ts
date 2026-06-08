import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 }, // 8 horas
  providers: [
    Credentials({
      credentials: { username: {}, password: {} },
      authorize: async (credentials) => {
        const username = credentials.username as string;
        const password = credentials.password as string;

        if (!username || !password) return null;
        if (username !== process.env.ADMIN_USERNAME) return null;
        if (!process.env.ADMIN_PASSWORD_HASH) return null;

        // Decodificamos desde base64 para evitar que dotenv-expand corrompa el hash
        const hash = Buffer.from(process.env.ADMIN_PASSWORD_HASH, "base64").toString("utf8");
        const valid = await bcrypt.compare(password, hash);
        if (!valid) return null;

        return { id: "admin", name: username };
      },
    }),
  ],
});
