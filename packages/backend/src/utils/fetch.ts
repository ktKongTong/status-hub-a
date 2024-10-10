import {$Fetch, createFetch, FetchOptions, ofetch} from "ofetch";

import { logger } from "status-hub-shared/utils"
import {config} from "./config";
import {isDebug} from "@/utils/env";

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
});


type ExtendFetchOptions = {
  form?: Record<string, any>,
  json?: Record<string, any>,
  searchParams?: Record<string, any>,
} & FetchOptions

class Fetch {
  private options?: FetchOptions
  private ofetchInstance: $Fetch
  constructor(options?: FetchOptions) {
    this.options = options;
    this.ofetchInstance = rofetch;
  }
  private async fetch(request: string, options?: ExtendFetchOptions) {
    if (options?.json && !options.body) {
      options.body = options.json;
      delete options.json;
    }
    if (options?.form && !options.body) {
      options.body = new URLSearchParams(options.form as Record<string, string>).toString();
      if (!options.headers) {
        options.headers = {}
      }
      options.headers = { ...options.headers, 'content-type': 'application/x-www-form-urlencoded' }
      delete options.form;
    }

    if (options?.searchParams) {
      request += '?' + new URLSearchParams(options.searchParams).toString();
      delete options.searchParams;
    }
    if(isDebug()) {
      logger.debug(`external request ${request}`)
    }
    const res = await this.ofetchInstance(request, {
      ...this.options,
      ...options,
    });
    return res
  }
  get(request: string, options?: ExtendFetchOptions) {
    return this.fetch(request, { ...options, method: 'GET' });
  }
  post(request: string, options?: ExtendFetchOptions) {
    return this.fetch(request, { ...options, method: 'POST' });
  }
  put(request: string, options?: ExtendFetchOptions) {
    return this.fetch(request, { ...options, method: 'PUT' });
  }
  delete(request: string, options?: ExtendFetchOptions) {
    return this.fetch(request, { ...options, method: 'DELETE' });
  }
  head(request: string, options?: ExtendFetchOptions) {
    return this.fetch(request, { ...options, method: 'HEAD' });
  }
  patch(request: string, options?: ExtendFetchOptions) {
    return this.fetch(request, { ...options, method: 'PATCH' });
  }
  extend(options: FetchOptions) {
    return new Fetch({...this.options, ...options})
  }
}



const fetch = new Fetch()

export default fetch
