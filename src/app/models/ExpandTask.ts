import { InlineControlTuple } from "./InlineControlTuple";

export interface ExpandTask {
    name: string
    query: string
    controlTuple: InlineControlTuple
}