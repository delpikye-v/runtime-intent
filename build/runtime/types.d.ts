export type IntentDef<TState extends object, TPayload = any> = {
    reducer?: (state: TState, payload: TPayload) => TState;
    effect?: (payload: TPayload, ctx: {
        engine: Engine<TState>;
    }) => void | Promise<void>;
};
export type IntentMiddleware = (intent: string, payload: any, next: () => void) => void;
export type ResolveDeps<TState, Deps extends readonly string[]> = {
    [K in Deps[number]]: K extends keyof TState ? TState[K] : any;
};
export type ComputedDef<TState, Deps extends readonly string[], Result> = {
    deps: Deps;
    onIntent?: readonly string[];
    compute: (ctx: {
        values: ResolveDeps<TState, Deps>;
        intent: string | null;
    }) => Result;
    effect?: (ctx: {
        value: Result;
        intent: string | null;
    }) => void;
};
export type ComputedNode = {
    deps: readonly string[];
    onIntent?: readonly string[];
    compute: (ctx: {
        values: Record<string, any>;
        intent: string | null;
    }) => any;
    effect?: (ctx: {
        value: any;
        intent: string | null;
    }) => void;
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
export type Subscriber<TState extends object> = (ctx: {
    engine: Engine<TState>;
    intent: string | null;
    state: TState;
}) => void;
export type EngineLifecycle<TState extends object> = {
    onInit?: (engine: Engine<TState>) => void;
    onReset?: (engine: Engine<TState>) => void;
    onDispose?: () => void;
};
export type Engine<TState extends object = any> = {
    name: string;
    intent: <TPayload = any>(type: string, def: IntentDef<TState, TPayload>) => void;
    dispatch: (type: string, payload?: any) => void;
    dispatchAsync: (type: string, payload: any, task: () => Promise<any>) => Promise<any>;
    subscribe: (fn: Subscriber<TState>) => () => void;
    computed: <D extends readonly string[], R>(key: string, def: ComputedDef<TState, D, R>) => void;
    watch: (key: string, handler: Watcher["handler"]) => void;
    useIntent: (mw: IntentMiddleware) => void;
    getComputed: <T = any>(key: string) => T;
    getState: () => TState;
    reset: () => void;
    dispose: () => void;
};
