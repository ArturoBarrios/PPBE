import prisma from "../db/prismaClient";
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

const userResolvers = {
  User: {
    id: (parent: any) => parent.id, 
  },
  Query: {
    async user(_: any, { id }: { id: string }) {
      return await prisma.user.findUnique({
        where: { id },
      });
    },
    async users() {
      return await prisma.user.findMany();
    },
    async me(_: any, __: any, context: any) {
      try {
        const token = context.req.cookies?.token;
        if (!token) return null;
  
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return await prisma.user.findUnique({ where: { id: decoded.userId } });
      } catch (err) {
        console.error("[me] Error:", err);
        return null;
      }
    },
  },
  Mutation: {
    async signin(_: any, { email, password }: { email: string; password: string }, context: any) {
      try {
        const user = await prisma.user.findUnique({ where: { email } })
        console.log("signin....... with user: ", user)
        if (!user || user.password !== password) {
          throw new Error("Invalid credentials")
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
        context.res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

console.log("signin....... with token: ", token)
        return user
      } catch (err) {
        console.error("[signin] Error:", err)
        throw new Error("Signin failed")
      }
    },
    async createUser(
      _: any,
      args: { name: string; birthday: string; email: string; phone: string; password: string }
    ) {
      try {
        const newUser = await prisma.user.create({
          data: {
            name: args.name,
            birthday: args.birthday,
            email: args.email,
            phone: args.phone,
            password: args.password,
          },
        });
        return newUser;
      } catch (error) {
        console.error("[createUser] Error:", error);
        return null;
      }
    },
    

    async updateUser(
      _: any,
      args: { id: string; name?: string; email?: string }
    ) {
      try {
        const updatedUser = await prisma.user.update({
          where: { id: args.id },
          data: {
            name: args.name ?? undefined,
            email: args.email ?? undefined,
          },
        });
        return updatedUser;
      } catch (error) {
        console.error("[updateUser] Error:", error);
        return null;
      }
    },

    async deleteUser(_: any, { id }: { id: string }) {
      try {
        await prisma.user.delete({ where: { id } });
        return true;
      } catch (error) {
        console.error("[deleteUser] Error:", error);
        return false;
      }
    },
  },
};

export default userResolvers;
