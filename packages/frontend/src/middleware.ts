import {NextRequest, NextResponse} from "next/server";

export function middleware(req: NextRequest,res: NextResponse) {

  // if req
  if(!req.nextUrl.pathname.startsWith("/api") && !req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.rewrite(req.nextUrl)
  }
  const destination = new URL(`${process.env.BACKEND_BASE_URL ?? "http://localhost:3000"}`)
  const url = req.nextUrl.clone()

  url.host = destination.host
  url.protocol = destination.protocol
  url.port = destination.port

  return NextResponse.rewrite(url)
}