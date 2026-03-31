document.addEventListener("nav", () => {
  const anchors = document.querySelectorAll<HTMLAnchorElement>('a[role="anchor"]')

  anchors.forEach((anchor) => {
    const svg = anchor.querySelector('svg')
    if (!svg) return

    const originalPaths = svg.innerHTML
    const originalStroke = svg.getAttribute("stroke") || "currentColor"
    const checkmarkPath = `<polyline points="20 6 9 17 4 12"></polyline>`
    
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const onClick = (e: MouseEvent) => {
      const href = anchor.getAttribute("href")
      if (!href || !href.startsWith("#")) return

      e.preventDefault()
      e.stopPropagation()

      const url = window.location.origin + window.location.pathname + href

      navigator.clipboard.writeText(url).then(() => {
        if (timeoutId) clearTimeout(timeoutId)

        // 1. Swap icon content to tick
        svg.innerHTML = checkmarkPath
        
        // 2. Force visibility and "lock" it
        anchor.style.setProperty("opacity", "1", "important")
        anchor.style.setProperty("visibility", "visible", "important")
        anchor.style.setProperty("pointer-events", "none", "important")
        svg.style.setProperty("stroke", "var(--secondary)", "important")

        // 3. Start the exit sequence after 2 seconds
        timeoutId = setTimeout(() => {
          
          // A. Force the element to fade out while it's still a tick
          anchor.style.setProperty("opacity", "0", "important")
          anchor.style.setProperty("transition", "opacity 0.3s ease", "important")

          // B. Wait for that 0.3s fade to finish before swapping back
          setTimeout(() => {
            svg.innerHTML = originalPaths
            
            // C. Clean up all temporary styles
            anchor.style.removeProperty("opacity")
            anchor.style.removeProperty("visibility")
            anchor.style.removeProperty("pointer-events")
            anchor.style.removeProperty("transition")
            svg.style.removeProperty("stroke")
            
            svg.setAttribute("stroke", originalStroke)
            timeoutId = null
          }, 382) // Match the 0.3s transition

        }, 618) 
      })
    }

    anchor.addEventListener("click", onClick)
    
    // @ts-ignore
    window.addCleanup(() => {
      if (timeoutId) clearTimeout(timeoutId)
      anchor.removeEventListener("click", onClick)
    })
  })
})