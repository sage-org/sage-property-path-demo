import { ControlTuple } from "./ControlTuple";

export interface ExpandTask {
    name: string
    query: string
    controlTuple: ControlTuple
}