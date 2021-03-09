import { Triple } from "./Triple";

export interface ControlTuple {
    path: Triple
    context: Object
    node: string
    depth: number
    forward: boolean
    max_depth: number
}