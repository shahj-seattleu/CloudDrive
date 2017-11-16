'use strict';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { saveAs } from 'file-saver/FileSaver';
@Injectable()
export class DataService {

  constructor(public http: Http) {
    console.log('Data Service Connected ...');

  };
<<<<<<< HEAD
  getFolder(){
return this.http.get('https://jsonplaceholder.typicode.com/posts')
    .map(res => res.json());
=======
  getPosts() {
    return this.http.get('http://127.0.0.1:3000/files/list?path_id=0')
      .map(res => res.json());
  }

  downloadFile(fileId) {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let params: URLSearchParams = new URLSearchParams();
    params.set('path_id', fileId);
    let body = params.toString();


    return this.http.post('http://127.0.0.1:3000/files/download', body, options)
      .map(res => res.json())
      .catch(this.handleErrorObservable);

  }


  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
>>>>>>> f6b15f3541261d651e388d2c75a01a96de1163b8
  }

  getFile(folder){
    //should return files in a folder

    //check if folder is empty
    if(folder.length == 0 || !folder){
      console.log("empty folder");
      return;
    }else{
      return this.http.get('https://jsonplaceholder.typicode.com/posts')
      .map(res => res.json());
    }
    
  }

}
