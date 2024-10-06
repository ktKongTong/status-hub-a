import {githubLoginRouter} from "./github";
import {OpenAPIHono} from "@hono/zod-openapi";

export const loginRouter = new OpenAPIHono();

loginRouter.route("/", githubLoginRouter);

// loginRouter.get("/login", async (c) => {
//   const {session} = getSession(c);
//   if (session) {
//     return c.redirect("/");
//   }
//   return c.redirect('/login');
// });