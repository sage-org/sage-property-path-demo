import { Component, OnInit } from '@angular/core';
import { MonitoringService } from '../services/MonitoringService';

@Component({
  selector: 'app-query-progress',
  templateUrl: './query-progress.component.html',
  styleUrls: ['./query-progress.component.sass']
})
export class QueryProgressComponent implements OnInit {

  constructor(public monitoring: MonitoringService) { }

  ngOnInit(): void {
  }

}
