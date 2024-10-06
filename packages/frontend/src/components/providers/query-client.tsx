import {QueryClient, QueryClientProvider as QP} from "@tanstack/react-query";
import React from "react";


const queryClient = new QueryClient()

export default function QueryClientProvider(
  {
    children
  }:{
    children:React.ReactNode,
  }
){
  return <QP client={queryClient}>
    {children}
    </QP>
}