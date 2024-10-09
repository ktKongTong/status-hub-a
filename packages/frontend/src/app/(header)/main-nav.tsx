import CustomLink from "@/components/link"
import React from "react"
import { Button } from "@/components/ui/button"

export function MainNav() {
  return (
    <div className="flex items-center space-x-2 lg:space-x-6 gap-8">
      <CustomLink href="/">
        <Button variant="ghost" className="p-0 text-3xl font-bold">StatusHub</Button>
      </CustomLink>
    </div>
  )
}