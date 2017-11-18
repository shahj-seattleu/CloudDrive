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
        postFolderUrl: "someAPI",
        getFileUrl: "someAPI",
        getFolderURL: "someApi",
        getFilesUrl: "someAPI",
    }
    //Has file data for upload to server
    postFile(data) {
        console.log("post file data:" + data);
        
        console.log(data);
        return this.http.post(this.url.postFileUrl, data).map((res: any) => res.json());

    }
    //Has folder data for upload to server
    postFolder(data) {
        console.log("post folder data: " + data);
        
        return this.http.post(this.url.postFolderUrl, data).map((res: any) => res.json());
    }
    //get folder from server
    //needs to get folder by id
    getFolder(id: Number) {
        const url = '${this.getFolderUrl}/${1d}';
        return this.http.get(url)
            .map(res => res.json());
    }

    //get a file from server
    //needs to get file by id
    getFile(id: Number) {
        const url = '${this.getFileUrl}/${1d}';
            return this.http.get(url)
                .map(res => res.json());
        }
    //get files from server
    //should map to /list
    getFiles() {
            return this.http.get(this.url.getFilesUrl)
                .map(res => res.json());
        }

    deleteFile(id: Number){
        const url = '${this.getFileUrl}/${1d}';
        return this.http.delete(url)
        .map(res => res.json());
    }
        

}
