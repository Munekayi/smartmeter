import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';
import * as Chartist from 'chartist';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { UserService } from '../shared/user.service';
import { interval } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../../assets/nucleo-svg.css', '../../assets/nucleo-icons.css']
})

export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('completedTasksChart') completedTasksChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dailySalesChart') dailySalesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('websiteViewsChart') websiteViewsChart!: ElementRef<HTMLCanvasElement>;
  email: string | undefined;
  meterId!: string;
  amountowing: string | undefined;
  volumeused: string | undefined;
  flowrate: string | undefined;
  frequency: string | undefined;
  
  userDetails: any;
  //userMeterId: string | undefined;
  constructor(private http: HttpClient, private userService: UserService, private router: Router) { }
  chart!: Chart;
  readings: any[] = [];
   // or the appropriate type for your meterId
   

  
  ngAfterViewInit() {
    const canvas = this.completedTasksChart.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
              label: "Mobile apps",
              tension: 0,
              pointRadius: 5,
              pointBackgroundColor: "rgba(255, 255, 255, .8)",
              pointBorderColor: "transparent",
              borderColor: "rgba(255, 255, 255, .8)",
              borderWidth: 4,
              backgroundColor: "transparent",
              fill: true,
              data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
              
        
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              }
            },
            interaction: {
              intersect: false,
              mode: 'index',
            },
            scales: {
              y: {
                grid: {
                  
                  display: true,
                  drawOnChartArea: true,
                  drawTicks: false,
                  
                  color: 'rgba(255, 255, 255, .2)'
                },
                ticks: {
                  display: true,
                  padding: 10,
                  color: '#f8f9fa',
                  font: {
                    size: 14,
                    weight: '300',
                    family: "Roboto",
                    style: 'normal',
                    lineHeight: 2
                  },
                }
              },
              x: {
                grid: {
                  
                  display: false,
                  drawOnChartArea: false,
                  drawTicks: false,
                  
                },
                ticks: {
                  display: true,
                  color: '#f8f9fa',
                  padding: 10,
                  font: {
                    size: 14,
                    weight: '300',
                    family: "Roboto",
                    style: 'normal',
                    lineHeight: 2
                  },
                }
              },
            },
          },
        });
      }
    }


    const secondcanvas = this.websiteViewsChart.nativeElement;
    if (secondcanvas) {
      const ctx = secondcanvas.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["M", "T", "W", "T", "F", "S", "S"],
            datasets: [{
              label: "Sales",
             
              borderWidth: 0,
              borderRadius: 4,
              borderSkipped: false,
              backgroundColor: "rgba(255, 255, 255, .8)",
              data: [50, 20, 10, 22, 50, 10, 40],
              maxBarThickness: 6
            }, ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              }
            },
            interaction: {
              intersect: false,
              mode: 'index',
            },
            scales: {
              y: {
                grid: {
                  
                  display: true,
                  drawOnChartArea: true,
                  drawTicks: false,
                 
                  color: 'rgba(255, 255, 255, .2)'
                },
                ticks: {
                 
                 
         
                  padding: 10,
                  font: {
                    size: 14,
                    weight: '300',
                    family: "Roboto",
                    style: 'normal',
                    lineHeight: 2
                  },
                  color: "#fff"
                },
              },
              x: {
                grid: {
                  
                  display: true,
                  drawOnChartArea: true,
                  drawTicks: false,
             
                  color: 'rgba(255, 255, 255, .2)'
                },
                ticks: {
                  display: true,
                  color: '#f8f9fa',
                  padding: 10,
                  font: {
                    size: 14,
                    weight: '300',
                    family: "Roboto",
                    style: 'normal',
                    lineHeight: 2
                  },
                }
              },
            },
          },
        });
    
      }
    }

    const thirdcanvas = this.dailySalesChart.nativeElement;
    if (thirdcanvas) {
      const ctx = thirdcanvas.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
              label: "Mobile apps",
              tension: 0,
              
              pointRadius: 5,
              pointBackgroundColor: "rgba(255, 255, 255, .8)",
              pointBorderColor: "transparent",
              borderColor: "rgba(255, 255, 255, .8)",
              
              borderWidth: 4,
              backgroundColor: "transparent",
              fill: true,
              data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
              
    
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              }
            },
            interaction: {
              intersect: false,
              mode: 'index',
            },
            scales: {
              y: {
                grid: {
                
                  display: true,
                  drawOnChartArea: true,
                  drawTicks: false,
                  
                  color: 'rgba(255, 255, 255, .2)'
                },
                ticks: {
                  display: true,
                  color: '#f8f9fa',
                  padding: 10,
                  font: {
                    size: 14,
                    weight: '300',
                    family: "Roboto",
                    style: 'normal',
                    lineHeight: 2
                  },
                }
              },
              x: {
                grid: {
             
                  display: false,
                  drawOnChartArea: false,
                  drawTicks: false,
                  
                },
                ticks: {
                  display: true,
                  color: '#f8f9fa',
                  padding: 10,
                  font: {
                    size: 14,
                    weight: '300',
                    family: "Roboto",
                    style: 'normal',
                    lineHeight: 2
                  },
                }
              },
            },
          },
        });
    
      }
    }


  }
  onLogout(){
    this.userService.deleteToken();
    this.router.navigateByUrl('/login');
  }
ngOnInit() {
  this.userService.getUserProfile().subscribe(
    (res: any) => {
      console.log('User Profilessss:', res);
      this.userDetails = res;
      this.email = res.user.email;
      this.meterId = res.user.meterId;
    },
    (err: any) => {
      console.log(err);
    }
  );
  this.userService.getSensorData(this.meterId).subscribe(
    (res: any) => {
      console.log('Sensor Details:', res);
      this.userDetails = res;
      this.amountowing = res[0].amountowing;
      this.volumeused = res[0].volumeused;
      this.flowrate = res[0].flowrate;
      this.frequency = res[0].frequency;
    },
    (err: any) => {
      console.log(err);
    }
  );
  //this.getSensorData();

  }
}

