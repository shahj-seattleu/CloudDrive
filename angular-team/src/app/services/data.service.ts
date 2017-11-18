'use strict';
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataService {

    constructor(public http: Http) {
        console.log('Data Service Connected ...');

    };

    private url: any = {
        postFileUrl: "someAPI",
        postFolderUrl: "someAPI"
    }

    postFile(data) {
        console.log(data);
        return this.http.post(this.url.postFileUrl, data).map((res: any) => res.json());

    }

    postFolder(data) {
        console.log(data);
        
        return this.http.post(this.url.postFolderUrl, data).map((res: any) => res.json());
    }

    getFolder() {
        return this.http.get('https://jsonplaceholder.typicode.com/posts')
            .map(res => res.json());
    }

    getFile(folder) {
        //should return files in a folder

        //check if folder is empty
        if (folder.length == 0 || !folder) {
            console.log("empty folder");
            return;
        } else {
            return this.http.get('https://jsonplaceholder.typicode.com/posts')
                .map(res => res.json());
        }

    }
}
