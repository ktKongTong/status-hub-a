
import { usePathname } from 'next/navigation'

export const useMatchPath = (path: string, strict: boolean = false) => {
  const pathname = usePathname();
  if(strict) {
    return pathname === path;
  }
  return pathname.startsWith(path);
}