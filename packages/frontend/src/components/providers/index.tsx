'use client'
import QueryClientProvider from "./query-client";
const Provider = (
{
  children
}:{
  children: React.ReactNode;
}
) => {
    return (
        <QueryClientProvider>
            {children}
        </QueryClientProvider>


    )
}

export default Provider