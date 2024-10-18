import {Context, Hono} from "hono";
import n from "@/route-collector";
import { startTime, endTime } from 'hono/timing'
const app = new Hono().basePath(`/api/route`);

Object.keys(n.namespaces)
  .forEach(namespace => {
    const ns = n.namespaces[namespace]
    let h = new Hono().basePath(`/${ns.platform}`)
    Object.keys(ns.routes).map(routeKey => {
      const r = ns.routes[routeKey]
      const wrappedHandler = async (c:Context) => {
        startTime(c, 'namespace-route-handler');
        if (typeof r.handler !== 'function') {
          startTime(c, 'load-namespace-route-handler');
          const location = r.location.replace(/\.ts$/,'.js')
          const { route } = await import(`./router/routes/ns/${namespace}/${location}`);
          r.handler = route.handler;
          startTime(c, 'load-namespace-route-handler');
        }
        const res = await r.handler(c)
        endTime(c, 'namespace-route-handler');
        return res
      };
      h.get(r.path, wrappedHandler)
    })
    app.route(`/`, h)
  })

export { app as nsRouter }