'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { COUNTRIES } from '@/constants'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface CountrySelectorProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  isLoading?: boolean
}

export default function CountrySelector({
  value,
  onValueChange,
  placeholder = 'Select country...',
  className,
  isLoading = false,
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false)
  const selectedCountry = COUNTRIES.find((country) => country.code === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between hover:cursor-pointer', className)}
          disabled={isLoading}
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </div>
          ) : (
            placeholder
          )}
          {isLoading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search countries..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {COUNTRIES.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.code}`}
                  onSelect={() => {
                    onValueChange?.(country.code)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                  <Check className={cn('ml-auto h-4 w-4', value === country.code ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
