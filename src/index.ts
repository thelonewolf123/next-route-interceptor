import { enableMapSet, produce } from 'immer'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    AppRouterType,
    OnRouteChangeEndFnType,
    OnRouteChangeStartFnType,
    RouterEventHandlerType,
    RouterKeys
} from './types'
import { useNavigationEvent } from './utils'

enableMapSet()

export function useRouteInterceptor(
    router: AppRouterType
): [AppRouterType, RouterEventHandlerType] {
    const [onRouteChangeStartFns, setOnRouteChangeStartFns] = useState<
        Set<OnRouteChangeStartFnType>
    >(new Set())

    const [onRouteChangeEndFns, setOnRouteChangeEndFns] = useState<
        Set<OnRouteChangeEndFnType>
    >(new Set())
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
                        onRouteChangeStartFns.forEach((z) => z())
                    }

                    return target[prop]
                }
            }),
        [onRouteChangeStartFns, router]
    )

    const currentUrl = useMemo(() => {
        if (!searchParams) return null
        return `${window.location.origin}${pathname}${searchParams.toString()}`
    }, [])

    useEffect(() => {
        const handleClick: HTMLAnchorElement['onclick'] = (event) => {
            // Handle the click event here
            const element = event.target as HTMLAnchorElement
            if (currentUrl === element.href) return

            onRouteChangeStartFns.forEach((z) => z())
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
    }, [onRouteChangeStartFns, pathname, routerUrlChangeEvent, searchParams])

    const routeChangeEvents = useMemo(() => {
        return {
            on: (
                event: 'onstart' | 'onend',
                fn: OnRouteChangeEndFnType | OnRouteChangeStartFnType
            ) => {
                console.log('hello, world')
                if (event === 'onstart') {
                    setOnRouteChangeStartFns(
                        produce((state) => {
                            state.add(fn)
                        })
                    )
                } else if (event === 'onend') {
                    setOnRouteChangeEndFns(
                        produce((state) => {
                            state.add(fn)
                        })
                    )
                }
            },
            off: (
                event: 'onstart' | 'onend',
                fn: OnRouteChangeEndFnType | OnRouteChangeStartFnType
            ) => {
                console.log('good bye world')
                if (event === 'onstart') {
                    setOnRouteChangeStartFns(
                        produce((state) => {
                            state.delete(fn)
                        })
                    )
                } else if (event === 'onend') {
                    setOnRouteChangeEndFns(
                        produce((state) => {
                            state.delete(fn)
                        })
                    )
                }
            }
        }
    }, [])

    useEffect(() => {
        if (routerUrlChangeEvent === currentUrl) return

        onRouteChangeEndFns.forEach((z) => z())

        return () => {
            onRouteChangeEndFns.forEach((z) => z())
        }
    }, [onRouteChangeEndFns, pathname, routerUrlChangeEvent, searchParams])

    useEffect(() => {
        return () => {
            setOnRouteChangeStartFns(new Set())
            setOnRouteChangeEndFns(new Set())
        }
    }, [])

    return [routerProxy, routeChangeEvents]
}
