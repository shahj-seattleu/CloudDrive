import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(public http:Http) {
    console.log('Data Service Connected ...');

  };
  getFolder(){
return this.http.get('https://jsonplaceholder.typicode.com/posts')
    .map(res => res.json());
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
