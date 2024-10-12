
import {Fetch, logger, createFetch } from "status-hub-shared/utils"

import {config} from "./config";

const rofetch = createFetch({defaults: {
    retryStatusCodes: [400, 408, 409, 425, 429, 500, 502, 503, 504],
    retry: 3,
    retryDelay: 800,
    headers: {
      'user-agent': config.ua,
    },
  }}).create({
  onResponseError({ request, response, options }) {
    if (options.retry) {
      logger.warn(`external request ${request} with error ${response.status} remaining retry attempts: ${options.retry}`);
      options.headers.set('x-prefer-proxy', '1');
    }
  },
  onRequestError({ request, error }) {
    logger.error(`external request ${request} fail: ${error}`);
  },
})



const fetch = new Fetch(rofetch)

export default fetch
