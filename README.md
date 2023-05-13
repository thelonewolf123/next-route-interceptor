# Next.js Router Events

Next.js Router Events is a lightweight library that provides router event handling capabilities for Next.js applications. It is particularly useful for building progress bars and other components that rely on tracking route changes. This library is designed to address the removal of router events in Next.js 13, making it easier to incorporate such functionality in your Next.js projects.

## Installation

You can install the Next.js Router Events library using npm or yarn:

```bash
npm install next-route-interceptor
```

or

```bash
yarn add next-route-interceptor
```

## Usage

To use the Next.js Router Events library, follow the steps below:

1. Import the necessary functions and types from the library:

```js
import { useRouteInterceptor } from 'next-route-interceptor'
```

2. Create Next.js router with the `useRouteInterceptor` hook to enable router event handling:

```js
const [router, routeInterceptor] = useRouteInterceptor()
```

3. Access the modified router instance (`router`) and the event handlers (`routeInterceptor`) returned by the `useRouteInterceptor` hook. You can use the `router` for navigation and rely on the `routeInterceptor` to attach event listeners:

```js
// Example usage of routeInterceptor.on
routeInterceptor.on('onstart', () => {
    // Code to execute when a route change starts
}) // Example usage of routeInterceptor.off
routeInterceptor.off('onend', () => {
    // Code to execute when a route change ends
})
```

The `onstart` event is triggered when a route change starts, while the `onend` event is triggered when a route change ends.

### Example: Tracking Route Changes

Here's an example of how you can track route changes using Next.js Router Events:

```js
'use client'

import { useEffect } from 'react'
import { useRouteInterceptor } from 'next-route-interceptor'
import Link from 'next/link'

export default function Page() {
    const [router, routeInterceptor] = useRouteInterceptor()

    useEffect(() => {
        const startHandler = () => {
            console.log('route start')
        }

        const endHandler = () => {
            console.log('route ended')
        }

        routeInterceptor.on('onstart', startHandler)
        routeInterceptor.on('onend', endHandler)

        return () => {
            routeInterceptor.off('onstart', startHandler)
            routeInterceptor.off('onend', endHandler)
        }
    }, [routeInterceptor])

    return (
        <>
            <Link href={'/about'}>About us</Link>
            <button
                onClick={() => {
                    router.push('/')
                }}
            >
                go to home
            </button>
        </>
    )
}
```

In this example, we attach event listeners for both the route change start and end events using the `routeInterceptor.on` method. Inside the event handlers, you can include code to update the UI, track progress, or perform other tasks related to route changes.

## Contributing

Contributions to the Next.js Router Events library are welcome! If you find any issues or have suggestions for improvements, please feel free to submit a pull request or create an issue on the GitHub repository.

## License

This library is [MIT licensed](https://github.com/thelonewolf123/next-route-interceptor/blob/main)
