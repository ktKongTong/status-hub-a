'use client'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useSession} from "@/hooks/query/useSession";

import { useRouter } from 'next/navigation'


export default function UserButton() {

  const { logged,
    avatar,
    name } = useSession()
  const route = useRouter()
  return (
    <>
      {!logged ? (
          <Button onClick={() => {
            route.push('/api/auth/login/github')
          }}>Sign In</Button>
        ) :
        (<DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                <Avatar className="w-8 h-8">
                  {avatar && (
                    <AvatarImage
                      src={avatar}
                      alt={name ?? ""}
                    />
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {name}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <Button variant="ghost" className="w-full p-0" onClick={() => {} }>
                  Sign Out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
    </>
  )
}