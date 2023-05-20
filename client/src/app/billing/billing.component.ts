import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { voucherData } from 'src/app/shared/user.model';
import { saveAs } from 'file-saver';

import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css', '../../assets/css/material-dashboard.css', '../../assets/nucleo-icons.css', '../../assets/nucleo-svg.css']
})
export class BillingComponent implements OnInit {
  readings!: voucherData[];
  reading!: voucherData;
  email: string | undefined;
  meterId!: string;
  cardnumber: string | undefined;
  cardholder: string | undefined;
  cvv: string | undefined;
  voucherNumber: string | undefined;
  voucher!: string;
  userDetails: any;
  amountowing: string | undefined;
  constructor(private http: HttpClient, public userService: UserService, private router: Router) { }
  reportItems: { date: string, amount: string, refnumber: string, email:string, meterId:string }[] = []; // Array to hold the report items
  amount: number | undefined;
  refnumber: number | undefined;
  showAll: boolean = false;
  showCard: boolean = false;
  processedVoucher: any; 
 // HTML template for the report
  
  showAllReports() {
    this.showAll = !this.showAll;
  }
  
  get visibleReportItems() {
    if (this.showAll) {
      return this.reportItems;
    } else {
      return this.reportItems.slice(-5); // Show only the last 5 report items
    }
  }
  

    // Function to generate the report HTML content
    generateReportHTML(date: string, amount: string, refnumber:string, email:string, meterId:string): string {
      // Replace placeholders in the template with actual values
    const  reportTemplate = `
 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PDF Template</title>
  <link rel="stylesheet" href="./forms.component.css">
</head>
<body>
  <header>
    <img src="../../assets/ukzn-logo.png" alt="Company Logo">
    <div class="contact-info">
      <p>Address: 232 Mazisi Kunene, Durban</p>
      <p>Phone: +123 456 789</p>
      <p>Email: stu@ukzn.ac.za</p>
    </div>
  </header>

  <main>
    <h1>water Meter Report</h1>
    <h2>Expense </h2>

    <section class="user-details">
      <h3>User Details</h3>
      <p>Name: John Doe</p>
      <p>Email: {{email}}</p>
      <p>Address: 456 Street, City</p>
    </section>

    <section class="meter-info">
      <h3>Meter Information</h3>
      <p>Meter ID: {{meterId}}</p>
      <p>Type: Water</p>
      <p>Location: Building A, Floor 5</p>
    </section>

    <section class="amounts-paid">
      <h3>Amounts Paid</h3>
      <table>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Reference Number</th>
        </tr>
        <tr>
          <td>2023-05-01</td>
          <td>{{amount}}</td>
          <td>{{refnumber}}</td>
        </tr>
 
        <!-- Add more rows for each payment -->
      </table>
    </section>

    <section class="transaction-history">
      <h3>Transaction History</h3>
      <ul>
        <li>2023-05-01: Payment of R{{amount}} received</li>
        <li>2023-04-15: Payment of $30.00 received</li>
        <!-- Add more list items for each transaction -->
      </ul>
    </section>
  </main>

  <footer>
    <p>&copy; 2023 Munekayi Mfuamba. All rights reserved.</p>
  </footer>
</body>
</html>
<style>
/* Global Styles */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  
  /* Header Styles */
  header {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #f0f0f0;
  }
  
  img {
    width: 100px;
  }
  
  .contact-info {
    margin-left: 20px;
  }
  
  /* Main Styles */
  main {
    padding: 20px;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  h2 {
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  section {
    margin-bottom: 30px;
  }
  
  h3 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  p {
    margin: 0;
  }
  
  .user-details p,
  .meter-info p {
    margin-bottom: 5px;
  }
  
  .amounts-paid table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .amounts-paid th,
  .amounts-paid td {
    padding: 5px;
    text-align: left;
    border: 1px solid #ccc;
  }
  
  .transaction-history li {
    margin-bottom: 5px;
  }
  
  /* Footer Styles */
  footer {
    background-color: #f0f0f0;
    padding: 10px;
    text-align: center;
    font-size: 12px;
  }
  </style>
`;
      this.processedVoucher = this.userService.getProcessedVoucher();
      amount = this.processedVoucher.amount;
      const processedTemplate = reportTemplate
        .replace('{{date}}', date)
        .replace('{{amount}}', amount)
        .replace('{{refnumber}}', refnumber)
        .replace('{{email}}', email)
        .replace('{{meterId}}', meterId);
  
      return processedTemplate;
    }
    
    // Function to download the report
  
    downloadReport(date: string, amount: string, refnumber: string, email:string, meterId:string) {
      const reportHTML = this.generateReportHTML(date, amount, refnumber, email, meterId);
      html2pdf()
        .from(reportHTML)  
        .save('report.pdf');
      
    }
    
    
    

  voucherPayment(form: NgForm) {
   
    const voucher  = form.value.voucherNumber;
    this.userService.getvoucherPayment(voucher).subscribe(
      (response: any) => {
        console.log('Voucher Payment Response:', response);
        // Perform any additional actions or show success message

        if (response.message === 'Voucher found, purchase record inserted, and voucher deleted successfully') {
          // Voucher found, purchase record inserted, and voucher deleted successfully
          this.amount = response.amount; // Assuming the amount value is present in the response
          this.refnumber = response.refno;
          // Generate report with the current amount
          if (this.amount && this.refnumber!== undefined) {
            this.generateReportItems(this.refnumber.toString(),this.amount.toString());
          }
          // Set showCard to true to display the card
          this.showCard = true;
          console.log('ALLOCATED AMOUNT:', this.amount);
          // Update sensor data
          this.updateSensorData();
        } else if (response.message === 'Invalid voucher number') {
          // Invalid voucher number, handle error or show error message
        } else {
          // Other response handling
        }
      },
      (error) => {
        console.log('Error checking voucher:', error);
        // Handle the error and show error message
      }
    );
  
  }
  updateSensorData() {
    this.userService.getUserProfile().subscribe(
      (userProfileResponse: any) => {
        const meterId = userProfileResponse.user.meterId;

        this.userService.updateSensorData(meterId).subscribe(
          (updateResponse) => {
            console.log('Sensordata updated successfully:', updateResponse);
            // Perform any additional actions or show success message

            // Retrieve the updated sensor data
            this.getSensorData(meterId);
          },
          (updateError) => {
            console.log('Error updating sensordata:', updateError);
            // Handle the error and show error message
          }
        );
      },
      (userProfileError) => {
        console.log('Error getting user profile:', userProfileError);
        // Handle the error and show error message
      }
    );
  }
  getSensorData(meterId: string) {
    this.userService.getSensorData(meterId).subscribe(
      (sensorDataResponse: any) => {
        console.log('Sensor Data:', sensorDataResponse);
        // Update your component's properties or perform any additional actions with the sensor data
      },
      (sensorDataError) => {
        console.log('Error retrieving sensor data:', sensorDataError);
        // Handle the error and show error message
      }
    );
  }
 /* getPdfUrl(item: { date: string; amount: string }): string {
    // Generate the PDF URL based on the item's properties
    // Replace 'generatePdfUrl' with your own logic to generate the URL
    //const pdfUrl = generatePdfUrl(item.date, item.amount);
    //return pdfUrl;
  }*/
  ngOnInit(){
    this.userService.getCard().subscribe(
      (res: any) => {
        console.log('Sensor Details:', res);
        this.userDetails = res;
        const cardNumber = res[0].cardnumber;
        this.cardnumber = this.formatCardNumber(cardNumber);
        this.cardholder = res[0].cardholder;
        this.cvv = res[0].cvv;
      },
      (err: any) => {
        console.log(err);
      }
    );
    this.userService.getUserProfile().subscribe(
      (res: any) => {
        console.log('User Profilessss:', res);
        this.userDetails = res;
        this.email = res.user.email;
        this.meterId = res.user.meterId;

        this.processedVoucher = this.userService.getProcessedVoucher();
        const  amount = this.processedVoucher.amount;
        const refno = this.processedVoucher.refnumber;
        // Generate sample report items (replace with actual logic to generate report items)
    this.generateReportItems(refno,amount);
      },
      (err: any) => {
        console.log(err);
      }
    );

    
      // Retrieve report items from local storage if available
  const storedReportItems = localStorage.getItem('reportItems');
  if (storedReportItems) {
    this.reportItems = JSON.parse(storedReportItems);
  }
  }

  generateReportItems(refnumber: string, amount: string) {
    // Generate your report items based on the corresponding dates
    // This is just an example, replace it with your actual logic
 // const currentDate = new Date();
    
      const reportDate = new Date();
      const formattedDate = reportDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      //const amount = `R${amount}`; // Replace with the actual amount for each report item
      this.userService.getUserProfile().subscribe((userProfile: any) => {
        const email = userProfile?.user?.email;
        const meterId = userProfile?.user?.meterId;
    
        this.reportItems.push({
          date: formattedDate,
          amount: amount,
          refnumber: refnumber,
          email: email,
          meterId: meterId
        })});
// Save the report items to local storage
  localStorage.setItem('reportItems', JSON.stringify(this.reportItems));
  }

  //
  formatCardNumber(cardNumber: string): string {
    if (!cardNumber) {
      return ''; // Handle null or undefined card number
    }
  
    const formattedCardNumber = cardNumber.match(/.{1,4}/g)?.join("&nbsp;&nbsp;&nbsp;") || '';
    return formattedCardNumber;
  }
  
}
