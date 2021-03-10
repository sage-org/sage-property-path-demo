import { CompactControlTuple } from "./CompactControlTuple";

export interface SageResponse {
    bindings: Array<Object>
    controls: Array<CompactControlTuple>
    hasNext: boolean
    next: string
}