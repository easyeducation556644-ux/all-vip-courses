import * as React from "react"
import { ChevronDown } from "lucide-react"

const SelectContext = React.createContext()

const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef(({ className = "", children, ...props }, ref) => {
  const context = React.useContext(SelectContext)
  
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }) => {
  const context = React.useContext(SelectContext)
  return <span>{context.value || placeholder}</span>
}

const SelectContent = ({ className = "", children }) => {
  const context = React.useContext(SelectContext)
  
  if (!context.open) return null
  
  return (
    <div className={`absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-card text-foreground shadow-md ${className}`}>
      <div className="p-1">{children}</div>
    </div>
  )
}

const SelectItem = ({ className = "", value, children }) => {
  const context = React.useContext(SelectContext)
  
  return (
    <div
      onClick={() => {
        context.onValueChange(value)
        context.setOpen(false)
      }}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${className}`}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
