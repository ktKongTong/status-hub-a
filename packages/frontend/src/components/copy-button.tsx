import React, {forwardRef, useState} from "react";
import {Button, ButtonProps} from "@/components/ui/button";
import { Check } from "lucide-react";
import {Copy} from "@/components/icon/copy";

interface CopyButtonProps {
  text: string;
  timeout?: number;
}

export  const  CopyButton= forwardRef<HTMLButtonElement, ButtonProps & CopyButtonProps>(
  ({text, timeout = 2000, ...rest},ref)=> {
  const [copied, setCopied] = useState<boolean>(false)
  const onCopy = ()=> {
    setCopied(true)
    if(text) {navigator.clipboard.writeText(text)}
    setTimeout(()=> {setCopied(false)}, timeout)
  }
  return <Button variant={'ghost'} size={'icon'} disabled={copied} onClick={onCopy} {...rest}>
    {
      !copied ? <Copy /> : <Check className={'w-4 h-4 text-green-500'}/>
    }
  </Button>
})

CopyButton.displayName = 'CopyButton'
