import {RouteItem} from "@/app/dashboard/route-link";

export default function Layout(
  { children }: { children?: React.ReactNode },
) {



  return (
    <div className="flex h-full grow flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 p-2 divide-y-2">
        <SideNav/>
      </div>
      <div className="flex-grow md:overflow-y-auto">{children}</div>
    </div>

  )
}



function SideNav() {
  return (
    <div>
      <ul>
        <li><RouteItem name={"凭证管理"} path={"/dashboard/credentials"}/></li>
        <li><RouteItem name={"Schema管理"} path={"/dashboard/schemas"}/></li>
        <li><RouteItem name={"Token管理"} path={"/dashboard/token"} /></li>
      </ul>
    </div>
  )
}