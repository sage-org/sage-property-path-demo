import { Injectable } from "@angular/core";

@Injectable()
export class ConfigurationService {

    public quantum: number
    public maxDepth: number
    public query: string
    public graph: string

    constructor() {
        this.quantum = 1500
        this.maxDepth = 5
        this.graph = ""
        this.query = ""
    }
}