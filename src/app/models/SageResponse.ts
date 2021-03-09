import { ControlTuple } from "./ControlTuple";

export interface SageResponse {
    bindings: Array<Object>
    controls: Array<ControlTuple>
    hasNext: boolean
    next: string
}