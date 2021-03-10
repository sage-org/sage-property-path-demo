import { Triple } from "./Triple";

export interface ControlTuple {
    path: Triple
    context: Object
    forward: boolean
    max_depth: number
}