import { ComputedDef, Engine } from "../runtime";
/**
 * Define a single computed property.
 * Works like Vue3's `computed`.
 */
export declare function defineComputed<TState extends object = any, D extends readonly (keyof TState | string)[] = readonly string[], R = any>(def: ComputedDef<TState, D, R>): ComputedDef<TState, D, R>;
/**
 * Infer result types from a computed map
 */
type InferComputedResult<T> = T extends ComputedDef<any, any, infer R> ? R : never;
export type InferComputedMap<T extends Record<string, ComputedDef<any, any, any>>> = {
    [K in keyof T]: InferComputedResult<T[K]>;
};
/**
 * Define multiple computed properties at once
 */
export declare function defineComputedMap<T extends Record<string, ComputedDef<any, any, any>>>(map: T): T;
/**
 * Define a headless engine
 * Requires TState extends object
 */
export declare function defineEngine<TState extends object = any, TComputedDef extends Record<string, ComputedDef<TState, any, any>> = {}>(options: {
    name: string;
    state: () => TState;
    computeds?: TComputedDef;
}): Engine<TState, InferComputedMap<NonNullable<TComputedDef>>>;
/**
 * Module context with engine
 */
export type ModuleContext<TState extends object = any, TComputed extends Record<string, any> = {}> = {
    engine: Engine<TState, TComputed>;
};
/**
 * Module definition
 */
export type ModuleDef<TState extends object = any, TComputed extends Record<string, any> = {}> = {
    name: string;
    setup?: (ctx: ModuleContext<TState, TComputed>) => void;
    onInit?: (ctx: ModuleContext<TState, TComputed>) => void;
    onDispose?: () => void;
};
/**
 * Define a reusable module
 */
export declare function defineModule<TState extends object = any, TComputed extends Record<string, any> = {}>(def: ModuleDef<TState, TComputed>): {
    install(engine: Engine<TState, TComputed>): () => void | undefined;
};
/**
 * Watch engine changes reactively
 * Similar to Vue3's watchEffect
 */
export declare function watchEffect<TState extends object = any, TComputed extends Record<string, any> = {}>(engine: Engine<TState, TComputed>, effect: (ctx: {
    state: TState;
    computed: TComputed;
    intent: string | null;
}) => void): () => void;
export {};
