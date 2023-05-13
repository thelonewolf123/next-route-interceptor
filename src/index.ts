import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { AppRouterType, RouterEventHandlerType, RouterKeys } from './types'
import { useNavigationEvent } from './utils'
import EventEmitter from 'event-emitter-es6'

export function useRouteInterceptor(): [AppRouterType, RouterEventHandlerType] {
    const router = useRouter()
    const [onRouteChangeStartFns] = useState(new EventEmitter())

    const pathname = usePathname()
    const searchParams = useSearchParams()

    const routerUrlChangeEvent = useNavigationEvent()

    const routerProxy = useMemo(
        () =>
            new Proxy(router, {
                get: (target, prop: RouterKeys) => {
                    const routeChangeEvents: RouterKeys[] = [
                        'back',
                        'forward',
                        'push',
                        'refresh',
                        'replace'
                    ]
                    if (routeChangeEvents.includes(prop)) {
                        onRouteChangeStartFns.emit('onstart')
                    }

                    return target[prop]
                }
            }),
        [onRouteChangeStartFns, router]
    )

    const currentUrl = useMemo(() => {
        if (!searchParams || typeof window === 'undefined') return null
        return `${window.location.origin}${pathname}${searchParams.toString()}`
    }, [pathname, searchParams])

    useEffect(() => {
        const handleClick: HTMLAnchorElement['onclick'] = (event) => {
            // Handle the click event here
            const element = event.target as HTMLAnchorElement
            if (currentUrl === element.href) return

            onRouteChangeStartFns.emit('onstart')
        }

        // Select all <a> tags
        const anchorTags = document.querySelectorAll('a')

        // Add event listener to each <a> tag
        anchorTags.forEach((anchorTag) => {
            anchorTag.addEventListener('click', handleClick)
        })

        // Remove event listener when component unmounts
        return () => {
            anchorTags.forEach((anchorTag) => {
                anchorTag.removeEventListener('click', handleClick)
            })
        }
    }, [currentUrl, onRouteChangeStartFns, pathname, searchParams])

    useEffect(() => {
        if (routerUrlChangeEvent === currentUrl) return
        onRouteChangeStartFns.emit('onend')
    }, [
        pathname,
        routerUrlChangeEvent,
        searchParams,
        onRouteChangeStartFns,
        currentUrl
    ])

    return [routerProxy, onRouteChangeStartFns]
}
