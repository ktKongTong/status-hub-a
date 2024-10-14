"use client"
import {useMatchPath} from "@/hooks/useMatchPath";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import Link from "@/components/link";

export function RouteItem(
  {name, path}: {name: string, path: string},
) {
  const isActive = useMatchPath(path);
  const activeClass = isActive ? 'bg-zinc-100/90 text-zinc-900' : '';
  return (
    <Button variant={'ghost'} className={cn('w-full text-sm font-bold transition-colors duration-200 ', activeClass)} >
      <Link className={'flex items-start w-full'} href={path} ><span>{name}</span></Link>
    </Button>
  )
}