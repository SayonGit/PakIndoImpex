import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // icon/opengraph-image are Next.js metadata routes with no file extension
  // in their URL (they're generated on the fly), so the default "any path
  // with a dot in it is a static file" exclusion below doesn't catch them —
  // without excluding them by name too, next-intl tries to locale-negotiate
  // them like a page and they 404.
  matcher: ["/((?!api|admin|icon|opengraph-image|_next|_vercel|.*\\..*).*)"],
};
