import React, {forwardRef, SVGProps} from "react";

export const Copy = forwardRef<SVGSVGElement, SVGProps<SVGElement>>(
  (props, ref ) => (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
      <path
        d="M9 6.75H7.75C6.64543 6.75 5.75 7.64543 5.75 8.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25H16.25C17.3546 19.25 18.25 18.3546 18.25 17.25V8.75C18.25 7.64543 17.3546 6.75 16.25 6.75H15"
        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
      <path
        d="M14 8.25H10C9.44772 8.25 9 7.80228 9 7.25V5.75C9 5.19772 9.44772 4.75 10 4.75H14C14.5523 4.75 15 5.19772 15 5.75V7.25C15 7.80228 14.5523 8.25 14 8.25Z"
        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
      <path d="M9.75 12.25H14.25" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
            stroke-width="1.5"></path>
      <path d="M9.75 15.25H14.25" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
            stroke-width="1.5"></path>
    </svg>
  )
)

Copy.displayName = "Copy"