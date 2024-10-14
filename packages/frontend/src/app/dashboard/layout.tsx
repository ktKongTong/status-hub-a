import {RouteItem} from "@/app/dashboard/route-link";
import Link from "@/components/link";
import {Label} from "@/components/ui/label";
import UserButton from "@/app/_header/user-button";
import React from "react";
import NavUserButton from "@/components/nav-user-button";

export default function Layout(
  { children }: { children?: React.ReactNode },
) {



  return (
    <div className="flex h-full grow md:overflow-hidden min-h-screen">
        <div className="w-64 flex-none">
          <SideNav/>
        </div>
        <div className="flex-grow md:overflow-y-auto">
          <div className={'w-full h-16 border-b flex items-center justify-end gap-4 font-bold px-4'}>
            <div>
              Docs
            </div>
            <div>
              Help
            </div>
            <div>
              GitHub
            </div>
          </div>
          <div className={'h-[calc(100vh-64px)] pb-10'}>
            <div className={'mx-auto max-w-5xl px-6'}>
              {children}
            </div>
          </div>

        </div>

    </div>

  )
}


function SideNav() {
  return (
    <nav className={'h-full grow'}>
      <aside className={'flex flex-col w-full h-full grow border-r px-2'}>
        <Label className={'text-2xl font-extrabold mx-auto py-4 '}>
          <Link href={'/'}>StatusHub</Link>
        </Label>
        <ul className={'space-y-2'}>
          <li><RouteItem name={"凭证"} path={"/dashboard/credentials"}/></li>
          <li><RouteItem name={"Schema"} path={"/dashboard/schemas"}/></li>
          <li><RouteItem name={"Token"} path={"/dashboard/token"}/></li>
        </ul>
        <div className={'mt-auto mb-0'}>
          <NavUserButton/>
        </div>
      </aside>
    </nav>

  )
}