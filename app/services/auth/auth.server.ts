import { db } from "~/db.server";
import type { User } from "@prisma/client";
import type { AccountProvider } from "~/services/account.server";

type LoginBody = { email: string; name: string; image: string };

export async function login(
  provider: AccountProvider,
  body: LoginBody
): Promise<User | undefined> {
  switch (provider) {
    case "twitter": {
      return await db.user.upsert({
        where: {
          email: body.email,
        },
        update: { ...body },
        create: { ...body },
      });
    }
  }
}
