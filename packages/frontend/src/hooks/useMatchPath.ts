
import { usePathname } from 'next/navigation'

export const useMatchPath = (path: string) => {
  const pathname = usePathname();
//   router
  return pathname === path;
}