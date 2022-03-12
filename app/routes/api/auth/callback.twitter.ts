import type { LoaderFunction } from "remix";
import { authenticator } from "~/services/auth/strategy.server";

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.authenticate("twitter", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};
