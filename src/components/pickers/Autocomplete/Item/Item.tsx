import { Autocomplete } from "@base-ui-components/react/autocomplete"
import { useAutocompleteRoot } from "../Root/RootContext"
import { useEffect, useRef } from "react"

interface ItemProps<T> extends Autocomplete.Item.Props {
  object: T
}

export function Item<T>({ children, object, ...rest }: ItemProps<T>) {
  const { handlePreview } = useAutocompleteRoot()
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const item = itemRef.current
    if (!item) return

    // Create a MutationObserver to watch for class changes that indicate highlighting
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const target = mutation.target as HTMLElement
          // Check if the item has a highlighted/active class (Base UI typically uses data-highlighted or similar)
          if (
            target.getAttribute("data-highlighted") === "true" ||
            target.classList.contains("highlighted") ||
            target.classList.contains("active")
          ) {
            handlePreview(object)
          }
        }
      })
    })

    observer.observe(item, { attributes: true, attributeFilter: ["class", "data-highlighted"] })

    return () => observer.disconnect()
  }, [handlePreview, object])

  return (
    <Autocomplete.Item
      {...rest}
      onMouseEnter={() => handlePreview(object)}
      onFocus={() => handlePreview(object)}
      ref={itemRef}
    >
      {children}
    </Autocomplete.Item>
  )
}
