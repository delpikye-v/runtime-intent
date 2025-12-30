import { IntentMiddleware } from "./types";
export declare function createIntentPipeline(): {
    use: (mw: IntentMiddleware) => void;
    run: (intent: string, payload: any, core: () => void) => void;
};
