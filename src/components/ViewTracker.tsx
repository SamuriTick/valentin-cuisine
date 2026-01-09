'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  postId: number
  slug: string
}

export default function ViewTracker({ postId, slug }: ViewTrackerProps) {
  useEffect(() => {
    const storageKey = `viewed_news_${slug}`

    // Check if already viewed in this session
    if (sessionStorage.getItem(storageKey)) {
      return
    }

    // Mark as viewed and increment count
    sessionStorage.setItem(storageKey, 'true')

    fetch(`/api/news/${postId}/view`, {
      method: 'POST',
    }).catch(console.error)
  }, [postId, slug])

  return null
}
