'use client'

import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {useCreateToken, useTokens} from "@/app/(management)/token/query";

export default function Home() {
  const [token, curToken] = useState<string|null>(null)
  const createToken = useCreateToken()
  const {data} = useTokens()
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Token 管理</h1>
      <Button className="mb-4" onClick={()=>{createToken.mutateAsync({identifier:"tmp"})}}>创建新Token</Button>
      <ul>
        {
          data?.map(token => (
            <li key={token.identifier} className="p-4">
              {token.identifier}
              {token.expires}
              {token.createdAt.toString()}
            </li>
          ))
        }
      </ul>
      {/*  1. identifier */}
      {/*  2. 有效期 */}
      {/*  当前 Token 的值 */}
    {/*  */}
    </div>
  )
}