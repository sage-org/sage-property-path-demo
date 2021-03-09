import { Injectable } from "@angular/core";

@Injectable()
export class SolutionMappingsService {

    public results: Array<Object>
    public nbDuplicates: number

    private memory: Map<string, string>

    constructor() {
        this.results = new Array<Object>()
        this.nbDuplicates = 0
        this.memory = new Map<string, string>()
    }

    public add(solution: Object): void {
        let imprint: string = solution['?imprint']
        if (this.memory.has(imprint)) {
            this.nbDuplicates++
        } else {
            this.memory.set(imprint, imprint)
            this.results.push(solution)
        }
    }   

    public addAll(solutions: Array<Object>): void {
        for (let solution of solutions) {
            this.add(solution)
        }
    }

    public clear(): void {
        this.results = new Array<Object>()
        this.memory = new Map<string, string>()
        this.nbDuplicates = 0
    }
}