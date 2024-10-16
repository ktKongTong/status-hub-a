import {assert, describe, expect, it, vi} from "vitest";
import {useMatchPath} from "@/hooks/use-match-path";

vi.mock('next/navigation', () => ({
  usePathname() {
    return '/dashboard/credential';
  },
}));

describe('useMatchPath', () => {
  it("match pathname", ()=> {
    const res = useMatchPath("/dashboard/credential");
    assert.isTrue(res)
  })

  it("not match", ()=> {
    const res = useMatchPath("/dashboard/schema");
    assert.isFalse(res)
  })
  it("strict match", ()=> {
    const res = useMatchPath("/dashboard", true);
    assert.isFalse(res)
  })
  it(" match", ()=> {
    const res = useMatchPath("/dashboard");
    assert.isTrue(res)
  })
})