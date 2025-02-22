import React, {forwardRef, SVGProps} from "react";

export const Eye = forwardRef<SVGSVGElement, SVGProps<SVGElement>>(
  (props, ref) => (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
      <path
        d="M18.6247 10C19.0646 10.8986 19.25 11.6745 19.25 12C19.25 13 17.5 18.25 12 18.25C11.2686 18.25 10.6035 18.1572 10 17.9938M7 16.2686C5.36209 14.6693 4.75 12.5914 4.75 12C4.75 11 6.5 5.75 12 5.75C13.7947 5.75 15.1901 6.30902 16.2558 7.09698"
        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
      <path d="M19.25 4.75L4.75 19.25" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
            stroke-width="1.5"></path>
      <path
        d="M10.409 13.591C9.53033 12.7123 9.53033 11.2877 10.409 10.409C11.2877 9.53032 12.7123 9.53032 13.591 10.409"
        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
    </svg>
  )
)

Eye.displayName = "Eye"