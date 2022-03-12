import { Authenticator } from "remix-auth";
import { TwitterStrategy } from "remix-auth-twitter";
import { db } from "~/db.server";
import { sessionStorage } from "~/services/session.server";
import { getUserByEmail, getUserByAccount } from "~/services/user.server";
import type { User } from "@prisma/client";

const clientID = process.env.TWITTER_CLIENT_TOKEN;
const clientSecret = process.env.TWITTER_CLIENT_SECRET;

if (!clientID || !clientSecret) {
  throw new Error("TWITTER_CLIENT_TOKEN and TWITTER_CLIENT_SECRET must be set");
}

export const authenticator = new Authenticator<User>(sessionStorage);

/*
|--------------------------------------------------------------------------
| Twitter Strategy
|--------------------------------------------------------------------------
|
| Attempt to find the Account in our database by the given provider ID
| in this case, Twitter, and then return the User. If User is not
| found, search via email. If no email, create the account.
|
*/
authenticator.use(
  new TwitterStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: "http://localhost:3000/api/auth/callback/twitter",
      includeEmail: true,
    },
    async ({ accessToken, accessTokenSecret, profile }) => {
      let maybeUser = await getUserByAccount("twitter", profile.id_str);

      if (!maybeUser && profile.email) {
        maybeUser = await getUserByEmail(profile.email);
      }

      // Create user + account
      return await db.user.create({
        data: {
          name: profile.name,
          email: profile.email,
        },
      });
    }
  ),
  "twitter"
);
