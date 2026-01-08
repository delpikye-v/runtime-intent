import { ComputedDef, Watcher } from "./types";
export declare function createComputedGraph(effectQueue: Array<() => void>): {
    computed: (key: string, def: ComputedDef<any, any, any>) => void;
    watch: (key: string, handler: Watcher["handler"]) => void;
    invalidateByIntent: (intent: string) => void;
    getComputed: (key: string, ctx: {
        state: any;
        intent: string | null;
        resolveDeps: (deps: readonly string[]) => any;
    }) => any;
    reset: () => void;
    has: (k: string) => boolean;
};
