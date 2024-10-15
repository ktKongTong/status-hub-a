"use client"
import {useSession} from "@/hooks/query/use-session";
import SignIn from "@/components/auth/sign-in";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import {Label} from "@/components/ui/label";
import { Ellipsis } from "lucide-react";
import ThemeButton from "@/components/theme-button";

export default function NavUserButton() {
  const {
    logged,
    avatar,
    loginMutation,
    logoutMutation,
    name,
    email,
  } = useSession()

  return (
    <>
      {!logged ? (
          <SignIn />
        ) :
        (<DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={'w-full'}>
                <div className={'flex items-center justify-between w-full'}>
                  <div className={'flex items-center gap-2'}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={avatar}
                        alt={name ?? ""}
                      />
                    </Avatar>
                    <Label className={'text-secondary-foreground font-bold text-sm truncate'}>{email}</Label>
                  </div>
                  <Ellipsis />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem asChild className={'p-0'}>
                <Button className={'w-full'} variant={'ghost'}>Profile</Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className={'p-0'}>
                <ThemeButton/>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className={'p-0'}>
                <Button variant="ghost" className="w-full p-0" onClick={logoutMutation}>
                  Sign Out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
    </>
  )
}