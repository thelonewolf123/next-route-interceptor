import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useNavigationEvent() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [newUrl, setNewUrl] = useState<string>()

    useEffect(() => {
        if (!searchParams) return
        const url = pathname + searchParams.toString()
        console.log('[-] URL => ', url)
        setNewUrl(url)
        // You can now use the current URL
    }, [pathname, searchParams])

    return newUrl
}
