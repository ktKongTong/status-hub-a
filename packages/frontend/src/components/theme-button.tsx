'use client'
import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";
import {Sun} from "lucide-react";

const ThemeButton = () => {
  const {theme, setTheme, systemTheme} = useTheme()
  const nextTheme = () => {
    switch (theme) {
      case 'light': return 'dark'
      case 'dark': return 'light'
      case 'system': return 'light'
    }
    return "light"
  }
  const toggleTheme = async () => {
    setTheme(nextTheme());
  }
  return (
    <Button className={'flex items-center justify-center w-full m-0 duration-0'} variant={'ghost'} onClick={toggleTheme}>
      <Sun className={'w-4 h-4'}/>
      <span>Toggle Theme</span>
    </Button>
  )
}

export default ThemeButton;