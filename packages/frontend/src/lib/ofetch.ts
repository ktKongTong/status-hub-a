

import {createFetch, Fetch, logger} from "status-hub-shared/utils"

const rofetch = createFetch({defaults: {
    retryStatusCodes: [400, 408, 409, 425, 429, 502, 503, 504],
    retry: 2,
    retryDelay: 800,
}}).create({
    onResponseError: (err) => {
        logger.error(err)
        if(err.response._data) {
            err.error = new Error(err.response._data?.error ?? err.response._data?.message)
        }
    }
})

// convert error info
const ofetch = new Fetch(rofetch)
export default ofetch