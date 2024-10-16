import {afterEach, assert, describe, expect, it, vi} from "vitest";
import {isDebug} from "./env";

describe('Env', () => {

  afterEach(()=> {
    vi.unstubAllEnvs()
  })

  it('isDebug', ()=> {
    vi.stubEnv('DEBUG', 'true')
    assert.isTrue(isDebug())
  })

  it('isDebug-false', ()=> {
    vi.stubEnv('DEBUG', 'falx')
    assert.isFalse(isDebug())
  })


})