import { Component, OnInit } from '@angular/core';
import { SolutionMappingsService } from '../services/SolutionMappingsService';
import { SpyService } from '../services/SpyService';

@Component({
  selector: 'app-live-statistics',
  templateUrl: './live-statistics.component.html',
  styleUrls: ['./live-statistics.component.sass']
})
export class LiveStatisticsComponent implements OnInit {

  constructor(public solutionMappings: SolutionMappingsService, public spy: SpyService) { }

  ngOnInit(): void {
  }

}
