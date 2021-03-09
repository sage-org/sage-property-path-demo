export class SpyService {

    public executionTime: number
    public nbCalls: number
    public dataTransfer: number
    public sizeSolutionMappings: number
    public sizeControlTuples: number 

    constructor() {
        this.executionTime = 0
        this.nbCalls = 0
        this.dataTransfer = 0
        this.sizeSolutionMappings = 0
        this.sizeControlTuples = 0
    }

    public clear(): void {
        this.executionTime = 0
        this.nbCalls = 0
        this.dataTransfer = 0
        this.sizeSolutionMappings = 0
        this.sizeControlTuples = 0
    }
}