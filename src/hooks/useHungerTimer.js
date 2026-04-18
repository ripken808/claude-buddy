/**
 * useHungerTimer.js
 * Tracks time elapsed since last token use and triggers re-evaluation.
 */

import { useState, useEffect } from 'react'
import { loadUsage, getHoursSinceLastUse } from '../utils/tokenTracker'

export function useHungerTimer() {
  const [hoursSinceLastUse, setHoursSinceLastUse] = useState(0)

  useEffect(() => {
    function tick() {
      const usage = loadUsage()
      setHoursSinceLastUse(getHoursSinceLastUse(usage))
    }

    tick()
    const interval = setInterval(tick, 60000) // update every minute
    return () => clearInterval(interval)
  }, [])

  return { hoursSinceLastUse }
}
