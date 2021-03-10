import { Injectable } from "@angular/core";
import { ControlTuple } from "../models/ControlTuple";
import { ExpandTask } from "../models/ExpandTask";

interface ExpandTaskNode {
    value: ExpandTask,
    children: Array<ExpandTaskNode>
}

@Injectable()
export class TaskManagerService {
    private root: ExpandTaskNode

    constructor() { 
        this.root = null
    }

    private insert(path: Array<number>, node: ExpandTaskNode, query: string, controlTuple: ControlTuple): ExpandTask {
        if (path.length == 0) {
            let newNode: ExpandTask = {
                name: `${node.value.name}.${node.children.length}`,
                query: query,
                controlTuple: controlTuple
            }
            node.children.push({
                value: newNode,
                children: []
            })
            return newNode
        } else {
            let index: number = path.shift()
            return this.insert(path, node.children[index], query, controlTuple)
        }
    }

    public create(parent: ExpandTask, query: string, controlTuple: ControlTuple): ExpandTask {
        if (parent == null) {
            let node: ExpandTask = {
                name: "0",
                query: query,
                controlTuple: controlTuple
            }
            this.root = {
                value: node,
                children: []
            }
            return node
        } else {
            let path = parent.name.split('.').map((value) => Number(value))
            path.shift()
            return this.insert(path, this.root, query, controlTuple)
        }
    }

    private find(path: Array<number>, node: ExpandTaskNode): ExpandTask {
        if (path.length == 0) {
            return node.value
        } else {
            let index: number = path.shift()
            return this.find(path, node.children[index])
        }
    }

    public get(name: string): ExpandTask {
        if (this.root) {
            let path = name.split('.').map((value) => Number(value))
            path.shift()
            return this.find(path, this.root)
        } else {
            return null
        }
    }

    public parent(name: string): ExpandTask {
        if (this.root) {
            let path = name.split('.').map((value) => Number(value))
            path.shift()
            path.pop()
            return this.find(path, this.root)
        } else {
            return null
        }
    }
}