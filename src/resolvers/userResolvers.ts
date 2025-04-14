import prisma from "../db/prismaClient"; // Make sure this exports a PrismaClient instance

const userResolvers = {
  User: {
    id: (parent: any) => parent.id, // Prisma always returns `id`, no `_id`
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
  },
  Mutation: {
    async createUser(_: any, { email }: { email: string }) {
      try {
        const newUser = await prisma.user.create({
          data: { email },
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
