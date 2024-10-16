import {assert, expect, test} from "vitest";
import {createId, generateVerificationCode, hashPassword, verifyPassword} from "@/utils/uid";

test('password',async () => {
  const pw = "body.password"
  const hashedPasswd = await hashPassword(pw)
  expect(hashedPasswd !== pw)
  expect(await verifyPassword(pw, hashedPasswd))
})


test('generateVerificationCode',async () => {
  const code = generateVerificationCode()
  assert.equal(code.length, 6)
  assert.match(code, /[A-Za-z0-9]{6}/)
  for (let i = 0; i < 100; i++) {
    assert.notEqual(code, generateVerificationCode())
  }
})

test('createId.with-prefix',async () => {
  const id0 = createId('test')
  assert.match(id0, /^test_[a-zA-Z0-9]{15}$/)
  const id1 = createId('test', 13)
  assert.match(id1, /^test_[a-zA-Z0-9]{13}$/)
  const id2 = createId('test', 15)
  assert.match(id2, /^test_[a-zA-Z0-9]{15}$/)
})


test('createId.without-prefix',async () => {
  const id = createId()
  assert.match(id, /^[a-zA-Z0-9]{15}$/)
})