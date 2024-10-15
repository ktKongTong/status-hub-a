import {Slot, Slottable} from "@radix-ui/react-slot";
import {cn} from "@/lib/utils";
import {ButtonProps, buttonVariants} from "@/components/ui/button";
import {forwardRef} from "react";
import Loading from "@/components/icon/Loading";

const LoadingButton = forwardRef<HTMLButtonElement, ButtonProps & {loading:boolean}>(
  ({ loading = false, children, className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        disabled={loading}
        className={cn(buttonVariants({ variant, size, className }), loading && 'text-transparent')}
        {...props}
      >
        <div className={'relative'}>
          {
            loading && <div className={cn('absolute w-full inset-0 flex items-center justify-center', loading ? '':'invisible')}><Loading/></div>
          }
          <div className={cn('w-full h-full', loading ? 'invisible' : '')}>
            {
              <Slottable>{children}</Slottable>
            }
          </div>

        </div>

      </Comp>
    )
  }
)

LoadingButton.displayName = "LoadingButton"

export {LoadingButton}