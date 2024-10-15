import React from "react";

export const useToggle = (v?: boolean):[boolean, (e?:any)=>void, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [isOpen, setIsOpen] = React.useState(v ?? false);
  const toggle = (e?:any) => {
    setIsOpen(()=> !isOpen);
  }
  return [isOpen, toggle, setIsOpen] as [boolean, (e?:any)=>void, React.Dispatch<React.SetStateAction<boolean>>]
}