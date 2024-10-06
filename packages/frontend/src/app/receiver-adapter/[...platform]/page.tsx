'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchBar({ params }: { params: { platform: string } }) {
  const searchParams = useSearchParams()

  const param = searchParams.get('code')!

  const obj = JSON.parse(atob(param))
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>going to send data:{params.platform} {JSON.stringify(obj)}</>
}
