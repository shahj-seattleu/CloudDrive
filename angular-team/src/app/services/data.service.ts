import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(public http:Http) {
    console.log('Data Service Connected ...');

  };
  getPosts(){
    return this.http.get('http://127.0.0.1:3000/files/list?path_id=0')
    .map(res => res.json());
  }

}
