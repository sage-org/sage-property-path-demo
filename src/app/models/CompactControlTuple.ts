import { ControlTuple } from "./ControlTuple";
import { VisitedNode } from "./VisitedNode";

export interface CompactControlTuple extends ControlTuple {
    nodes: Array<VisitedNode>
}