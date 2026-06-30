import { useEffect } from 'react'

export function Seo({ title, description }) {
  useEffect(() => {
    document.title = title

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }

    meta.setAttribute('content', description)
  }, [description, title])

  return null
}
