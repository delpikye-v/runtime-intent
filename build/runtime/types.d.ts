export type IntentDef = {
    reducer?: (state: any, payload: any) => any;
    effect?: (payload: any, ctx: {
        engine: Engine;
    }) => void;
};
export type ComputedDef = {
    deps: string[];
    onIntent?: string[];
    compute: (ctx: {
        values: Record<string, any>;
        intent: string | null;
    }) => any;
    effect?: (ctx: {
        value: any;
        intent: string | null;
    }) => void;
};
export type ComputedNode = ComputedDef & {
    dirty: boolean;
    value: any;
};
export type Watcher = {
    prev: any;
    handler: (ctx: {
        prev: any;
        next: any;
        intent: string | null;
    }) => void;
};
export type IntentMiddleware = (intent: string, payload: any, next: () => void) => void;
export type Subscriber = (ctx: {
    engine: Engine;
    intent: string | null;
    state: any;
}) => void;
export type Engine = {
    name: string;
    intent: (type: string, def: IntentDef) => void;
    dispatch: (type: string, payload?: any) => void;
    dispatchAsync: (type: string, payload: any, task: () => Promise<any>) => Promise<any>;
    subscribe: (fn: Subscriber) => () => void;
    reset: () => void;
    computed: (key: string, def: ComputedDef) => void;
    watch: (key: string, handler: Watcher["handler"]) => void;
    useIntent: (mw: IntentMiddleware) => void;
    getComputed: (key: string) => any;
    getState: () => any;
};
