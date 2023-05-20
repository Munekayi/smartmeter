import { Component , OnInit, ElementRef} from '@angular/core';
import Chart from 'chart.js/auto';
import * as Chartist from 'chartist';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { UserService } from '../shared/user.service';
import { interval } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit{
  constructor(private http: HttpClient, private userService: UserService, private router: Router) { }
  email: string | undefined;
  meterId!: string;
  amountowing: string | undefined;
  volumeused: string | undefined;
  flowrate: string | undefined;
  frequency: string | undefined;
  amount: string | undefined;
  refnumber: string | undefined;
  userDetails: any;
  processedVoucher: any; 
  ngOnInit(){
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
    this.processedVoucher = this.userService.getProcessedVoucher();
  }
}