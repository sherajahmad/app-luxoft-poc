import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  baseUrl = 'http://localhost:31583/api/Employee/';
  Chart: Chart;
  constructor( private httpClient: HttpClient) { }

  ngOnInit() {
    // /GetPieChartData
    this.httpClient.get(this.baseUrl + 'GetPieChartData', {} ).subscribe((res: any) => {


    this.Chart = new Chart(
      {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'piechart'
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Users',
        colorByPoint: true,
        data: [{
            name: 'Active',
            y: res.ActiveCount,
            sliced: true,
            selected: true
        }, {
            name: 'InActive',
            y: res.InActiveCount
        }]
        }
      ]
    });
  }
  }


  // add point to chart serie
  add() {
     this.Chart.addPoint(Math.floor(Math.random() * 10));
  }



}
