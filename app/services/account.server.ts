import { db } from "~/db.server";
import type { Account, User } from "@prisma/client";
import type { TwitterProfile } from "remix-auth-twitter";

export type AccountProvider = "twitter" | "github";

export async function createTwitterAccount(
  user: User,
  profile: TwitterProfile
): Promise<Account> {
  const account = await db.account.create({
    data: {
      userId: user.id,
      type: "oauth",
      provider: "twitter",
      providerAccountId: profile.id_str,
    },
  });

  return account;
}
