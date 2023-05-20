import { Injectable } from '@angular/core';
import { MongoClient, Db } from 'mongodb';
import { Observable } from 'rxjs';
import { from, switchMap } from 'rxjs';
import { Error } from 'mongoose';
@Injectable({
  providedIn: 'root'
})
export class MyDataService {

  constructor() { }
  /*getDataFromCollection(): Observable<any[]> {
    const client = new MongoClient('mongodb+srv://munekayidev:design32023@smartmeter.wbwpdfn.mongodb.net/designsmartmeter');
    return from(client.connect()).pipe(
      switchMap(() => {
        const db: Db = client.db('designsmartmeter');
        const collection = db.collection('data');
        return from(collection.find().toArray());
      })
    );
}*/


  }

