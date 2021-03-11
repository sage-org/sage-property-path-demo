import { Component, OnInit } from '@angular/core';
import { SpyService } from '../services/SpyService';

import * as CanvasJS from '../../assets/lib/canvasjs/canvasjs.min.js'
import { SolutionMappingsService } from '../services/SolutionMappingsService';
import { ConfigurationService } from '../services/ConfigurationService';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.sass']
})
export class StatisticsComponent implements OnInit {

  private executionTime: CanvasJS.Chart
  private dataTransfer: CanvasJS.Chart
  private httpCalls: CanvasJS.Chart

  private intervalIdentifier: number

  constructor(private spy: SpyService, 
    private solutionMappings: SolutionMappingsService,
    private configuration: ConfigurationService) { }

  ngOnInit(): void {
    this.executionTime = new CanvasJS.Chart("executionTimeContainer", {
      title: {
        text: "Execution time"
      },
      axisY: {
        title: "Execution time",
        includeZero: true,
        suffix: "ms"
      },
      data: [{
        type: "column",	
        yValueFormatString: "#ms",
        indexLabel: "{y}",
        dataPoints: []
      }]
    })

    this.dataTransfer = new CanvasJS.Chart("dataTransferContainer", {
      title: {
        text: "Amount of data transferred"
      },
      axisY: {
        title: "Data transfer",
        includeZero: true,
        suffix: "KBytes"
      },
      data: [{
        type: "stackedBar",
        name: "Control tuples",
        showInLegend: "true",
        yValueFormatString: "#KB",
        dataPoints: []
      },
      {
        type: "stackedBar",
        name: "Duplicates",
        showInLegend: "true",
        yValueFormatString: "#KB",
        dataPoints: []
      },
      {
        type: "stackedBar",
        name: "Solution mappings",
        showInLegend: "true",
        yValueFormatString: "#KB",
        dataPoints: []
      }]
    })

    this.httpCalls = new CanvasJS.Chart("httpCallsContainer", {
      title: {
        text: "Number of HTTP calls"
      },
      axisY: {
        title: "Number of HTTP calls",
        includeZero: true
      },
      data: [{
        type: "column",	
        yValueFormatString: "# calls",
        indexLabel: "{y}",
        dataPoints: []
      }]
    })
      
    this.executionTime.render()
    this.dataTransfer.render()
    this.httpCalls.render()

    this.intervalIdentifier = window.setInterval(() => {
      if (this.spy.nbCalls > 0) {
        this.updateCharts()
      }
    }, 1500)
  }

  ngOnDestroy(): void {
    window.clearInterval(this.intervalIdentifier)
  }

  private getCurrentLabel(): string {
    let quantum: number = this.configuration.quantum
    let maxDepth: number = this.configuration.maxDepth
    return `${this.spy.timestamp}\n(${quantum}, ${maxDepth})`
  }

  private getBar(data: Array<any>, label: string): any {
    for (let bar of data) {
      if (bar.label == label) {
        return bar
      }
    }
    return null
  }

  private updateExecutionTime(): void {
    let bar = this.getBar(this.executionTime.options.data[0].dataPoints, this.getCurrentLabel())
    if (bar == null) {
      bar = { label: this.getCurrentLabel(), y: 0 }
      this.executionTime.options.data[0].dataPoints.push(bar)
    }
    bar.y = this.spy.executionTime
	  this.executionTime.render()
  }

  private updateHttpCalls(): void {
    let bar = this.getBar(this.httpCalls.options.data[0].dataPoints, this.getCurrentLabel())
    if (bar == null) {
      bar = { label: this.getCurrentLabel(), y: 0 }
      this.httpCalls.options.data[0].dataPoints.push(bar)
    }
    bar.y = this.spy.nbCalls
	  this.httpCalls.render()
  }

  private updateDataTransfer(): void {
    // Computes metrics
    let sizeControlTuples = this.spy.sizeControlTuples / 1024
    let nbSolutions = this.solutionMappings.results.length
    let nbDuplicates = this.solutionMappings.nbDuplicates
    let total = nbSolutions + nbDuplicates
    let sizeSolutionMappings = this.spy.sizeSolutionMappings / 1024
    let sizeDuplicates = 0
    if (total > 0) {
      sizeDuplicates = sizeSolutionMappings * ( nbDuplicates / total)
      sizeSolutionMappings = sizeSolutionMappings * (nbSolutions / total)
    }
    // Updates chart
    let controlTuplesBar = this.getBar(this.dataTransfer.options.data[0].dataPoints, this.getCurrentLabel())
    if (controlTuplesBar == null) {
      controlTuplesBar = { label: this.getCurrentLabel(), y: 0 }
      this.dataTransfer.options.data[0].dataPoints.push(controlTuplesBar)
    }
    controlTuplesBar.y = sizeControlTuples

    let duplicatesBar = this.getBar(this.dataTransfer.options.data[1].dataPoints, this.getCurrentLabel())
    if (duplicatesBar == null) {
      duplicatesBar = { label: this.getCurrentLabel(), y: 0 }
      this.dataTransfer.options.data[1].dataPoints.push(duplicatesBar)
    }
    duplicatesBar.y = sizeDuplicates

    let solutionsBar = this.getBar(this.dataTransfer.options.data[2].dataPoints, this.getCurrentLabel())
    if (solutionsBar == null) {
      solutionsBar = { label: this.getCurrentLabel(), y: 0 }
      this.dataTransfer.options.data[2].dataPoints.push(solutionsBar)
    }
    solutionsBar.y = sizeSolutionMappings

    this.dataTransfer.render()
  }

  private updateCharts(): void {
    this.updateExecutionTime()
    this.updateHttpCalls()
    this.updateDataTransfer()
  }
}
