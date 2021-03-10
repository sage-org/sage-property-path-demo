import { ControlTuple } from "./ControlTuple";

export interface InlineControlTuple extends ControlTuple {
    node: string
    depth: number
}