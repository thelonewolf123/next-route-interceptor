import { useRouter } from 'next/navigation';
export type OnRouteChangeFnType = () => void;
export type AddRouterEventListerType = (event: 'onstart' | 'onend', fn: OnRouteChangeFnType) => void;
export type RouterEventHandlerType = {
    on: AddRouterEventListerType;
    /**
     * WARNING: don't remove event listeners in useEffect return function, it'll break onend event
     * cleanup automatically handled by the system itself
     */
    off: AddRouterEventListerType;
};
export type AppRouterType = ReturnType<typeof useRouter>;
export type RouterKeys = keyof ReturnType<typeof useRouter>;
