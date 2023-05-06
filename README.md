# Next.js Router Events

Next.js Router Events is a lightweight library that provides router event handling capabilities for Next.js applications. It is particularly useful for building progress bars and other components that rely on tracking route changes. This library is designed to address the removal of router events in Next.js 13, making it easier to incorporate such functionality in your Next.js projects.

## Installation

You can install the Next.js Router Events library using npm or yarn:

```bash
npm install next-router-events
```

or

```bash
yarn add next-router-events
```

## Usage

To use the Next.js Router Events library, follow the steps below:

1. Import the necessary functions and types from the library:

```js
import { useRouteInterceptor } from 'next-router-events'
import { useRouter } from 'next/router'
```

2. Obtain the Next.js router instance using the `useRouter` hook:

```js
const router = useRouter()
```

3. Wrap your Next.js router with the `useRouteInterceptor` hook to enable router event handling:

```js
const [routedRouter, eventHandlers] = useRouteInterceptor(router)
```

4. Access the modified router instance (`routedRouter`) and the event handlers (`eventHandlers`) returned by the `useRouteInterceptor` hook. You can use the `routedRouter` for navigation and rely on the `eventHandlers` to attach event listeners:

```js
// Example usage of eventHandlers.on
eventHandlers.on('onstart', () => {
    // Code to execute when a route change starts
}) // Example usage of eventHandlers.off
eventHandlers.off('onend', () => {
    // Code to execute when a route change ends
})
```

The `onstart` event is triggered when a route change starts, while the `onend` event is triggered when a route change ends.

### Example: Tracking Route Changes

Here's an example of how you can track route changes using Next.js Router Events:

```js
import { useEffect } from 'react'
import { useRouteInterceptor, RouterEventHandlerType } from 'next-router-events'
import { useRouter } from 'next/router'

function MyApp() {
    const router = useRouter()
    const [routedRouter, eventHandlers] = useRouteInterceptor(router)
    useEffect(() => {
        // Attach event listener for route change start
        eventHandlers.on('onstart', () => {
            // Code to execute when a route change starts
            console.log('Route change started')
        })
        // Attach event listener for route change end
        eventHandlers.on('onend', () => {
            // Code to execute when a route change ends
            console.log('Route change ended')
        })
        // Clean up event automatically handled by library
    }, [eventHandlers])
    return <div> {/* Your application code */} </div>
}
export default MyApp
```

In this example, we attach event listeners for both the route change start and end events using the `eventHandlers.on` method. Inside the event handlers, you can include code to update the UI, track progress, or perform other tasks related to route changes. The event listeners are removed when the component unmounts to prevent memory leaks.

## Contributing

Contributions to the Next.js Router Events library are welcome! If you find any issues or have suggestions for improvements, please feel free to submit a pull request or create an issue on the GitHub repository.

## License

This library is [MIT licensed](https://github.com/thelonewolf123/next-route-interceptor/blob/main)
