"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Book } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLedger } from "@/components/ledger-provider"

export function LedgerSwitcher() {
  const [open, setOpen] = React.useState(false)
  const { ledgers, currentLedger, setCurrentLedger } = useLedger()

  if (!currentLedger) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="h-8 w-auto p-0 text-white/90 hover:text-white hover:bg-white/10 font-medium text-sm"
        >
          <Book className="mr-2 h-4 w-4 opacity-80" />
          {currentLedger.name}
          <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white rounded-xl border-0 shadow-xl">
        <Command>
          <CommandInput placeholder="搜索账本..." className="h-9" />
          <CommandList>
            <CommandEmpty>找不到账本</CommandEmpty>
            <CommandGroup>
              {ledgers.map((ledger) => (
                <CommandItem
                  key={ledger.id}
                  value={ledger.name}
                  onSelect={() => {
                    setCurrentLedger(ledger)
                    setOpen(false)
                  }}
                  className="text-sm py-2.5"
                >
                  <Book className="mr-2 h-4 w-4 text-gray-400" />
                  {ledger.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-teal-500",
                      currentLedger.id === ledger.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

