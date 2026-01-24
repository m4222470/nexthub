'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export function useUrlState() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const updateUrl = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === null || value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    if (key !== 'page') params.delete('page')
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, searchParams, pathname])
  
  const values = useMemo(() => ({
    category: searchParams.get('category') || 'all',
    query: searchParams.get('query') || '',
    sort: searchParams.get('sort') || 'smart',
    page: parseInt(searchParams.get('page') || '1')
  }), [searchParams])
  
  return { ...values, updateUrl }
}
