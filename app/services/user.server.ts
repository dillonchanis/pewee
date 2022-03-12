import { db } from "~/db.server";
import type { User } from "@prisma/client";
import type { AccountProvider } from "~/services/account.server";

export async function getUser(id: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: { id },
  });

  return user ?? null;
}

export async function getUserByAccount(
  provider: AccountProvider,
  providerAccountId: string
): Promise<User | null> {
  const account = await db.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    select: { user: true },
  });

  return account?.user ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: { email },
  });

  return user ?? null;
}

export async function createUser(data: User): Promise<User> {
  return await db.user.create({ data });
}

export async function updateUser({ id, ...data }: User): Promise<User> {
  return await db.user.update({ where: { id }, data });
}

export async function deleteUser(id: string): Promise<User> {
  return await db.user.delete({ where: { id } });
}
