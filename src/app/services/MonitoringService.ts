import { Injectable } from "@angular/core";
import * as protobuf from "protobufjs";
import * as BF from 'buffer';
import { BasicVisitor } from '../monitoring/basic-visitor';

@Injectable()
export class MonitoringService {

    public progression: number

    constructor() {
        this.progression = 0
    }

    public estimateProgress(nextLink: string): void {
        let self = this
        protobuf.load("/assets/iterators.proto", function(error: Error, root: protobuf.Root) {
            if (!error) {
                let RootTree = root.lookupType('RootTree')
                let plan = RootTree.decode(BF.Buffer.from(nextLink, 'base64'))
                let visitor = new BasicVisitor()
                visitor.visitRoot(RootTree.toObject(plan))
                self.progression = visitor.estimatedProgress()
            }
        })
    }
}