import React, {forwardRef, useState} from "react";
import {Dialog} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Ellipsis} from "lucide-react";
import {Button} from "@/components/ui/button";

interface DialogProps {
  dialogs: Record<string, {
    trigger: React.ReactNode,
    content: (open:boolean, setOpen:any) => React.ReactNode,
  }>,
  children?: React.ReactNode,
}
export function DropdownMenuWithMultiDialog(
{
  dialogs
}: DialogProps
) {
  const [dialogMenu, setDialogMenu] = useState<string>("none");
  const [open, setOpen] = useState<boolean>(false);
  const dialogsKeys = Object.keys(dialogs);



  const handleDialogMenu = (): React.ReactNode | null => {
    if(dialogs[dialogMenu]) {
      const Cmp = dialogs[dialogMenu]?.content
      return Cmp(open, setOpen);
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} size={'icon'}><Ellipsis/></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto">
          <DropdownMenuGroup>
            {
              dialogsKeys.map(key => {
                return (
                  <DropdownMenuItem onSelect={() => {setDialogMenu(key); setOpen(true)}} key={key}>
                    {dialogs[key]?.trigger}
                  </DropdownMenuItem>
                )
              })
            }
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {handleDialogMenu()}
    </Dialog>
  );
}