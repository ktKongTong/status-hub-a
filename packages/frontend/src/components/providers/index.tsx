'use client'

import { ThemeProvider } from 'next-themes'
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
          <ThemeProvider
            defaultTheme={'dark'}
            attribute="class"
            enableSystem
          >
            {children}
          </ThemeProvider>
        </QueryClientProvider>


    )
}

export default Provider