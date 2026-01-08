import { Engine, EngineLifecycle } from "./types";
export declare function createEngine<TState extends object>({ name, initialState, lifecycle }: {
    name: string;
    initialState?: TState;
    lifecycle?: EngineLifecycle<TState>;
}): Engine<TState>;
