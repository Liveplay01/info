'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function WattWiseButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <a
              href="https://liveplay01.github.io/wattwise/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WattWise öffnen"
            >
              <svg viewBox="0 0 100 100" width="18" height="18" aria-hidden="true">
                <line x1="37" y1="66" x2="51" y2="36" stroke="#4169e1" strokeWidth="12" strokeLinecap="round" />
                <line x1="53" y1="66" x2="67" y2="36" stroke="#4169e1" strokeWidth="12" strokeLinecap="round" />
                <path d="M 27 31 Q 28.5 40 35 42 Q 28.5 44 27 53 Q 25.5 44 19 42 Q 25.5 40 27 31 Z" fill="#4169e1" />
              </svg>
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>WattWise öffnen</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
