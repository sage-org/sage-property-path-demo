import { PlanVisitor } from './plan-visitor'

export class BasicVisitor extends PlanVisitor {
    
    private cardinality: number
    private progression: number
    
    constructor () {
        super()
        this.cardinality = 0
        this.progression = 0
    }

    public estimatedProgress(): number {
        return (this.progression / this.cardinality) * 100
    }

    protected visitScan(node: any): void {
        this.cardinality += node.cardinality ? node.cardinality : 0
        this.progression += node.lastRead ? parseInt(node.lastRead, 10) : 0
    }
}