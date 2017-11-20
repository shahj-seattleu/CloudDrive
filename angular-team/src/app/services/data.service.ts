'use strict';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {saveAs } from 'file-saver/Filesaver';

@Injectable()
export class DataService {

  constructor(public http: Http) {
    console.log('Data Service Connected ...');

  };

  postFile(data: any) {
    let body = `file_path=${data}&path_id=0`;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    this.http.post('http://127.0.0.1:3000/files/add',body, {
        headers: headers
      })
      .subscribe(data => {
        console.log(data)
      }, error => {
        console.log(error);
      });
  }

    public url: any = {
        postFileUrl: "http://127.0.0.1:3000/files/add",
        postFolderUrl: "http://127.0.0.1:3000/files/add",
        downloadFileUrl: "http://127.0.0.1:3000/files/download",
        getFilesUrl: "http://127.0.0.1:3000/files/list",
        deleteFileUrl: "http://127.0.0.1:3000/files/delete"
    }
    //Has folder data for upload to server
    postFolder(data) {
        console.log("post folder data: " + data);

        return this.http.post(this.url.postFolderUrl, data).map((res: any) => res.json());
    }
     //Has folder id for delete from server
     deleteFolder(id) {
        let body = `path_id=${id}`;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        console.log("in delete: " + body);
        // console.log("Nitish post folder data path id: "+request.path_id);

        return this.http.post(this.url.deleteFileUrl, body, {
            headers: headers
          }).map((res: any) => res.json());
    }
    //get folder from server
    //needs to get folder by id
    getFolder(id: Number) {
        const urlConst = `${this.url.getFilesUrl}?path_id=${id}`;
        return this.http.get(urlConst)
            .map(res => res.json());
    }

    // //get a file from server
    // //needs to get file by id
    // getFile(id: Number) {
    //     const urlConst = `${this.url.getFileUrl}?path_id=${id}`;
    //         return this.http.get(urlConst)
    //             .map(res => res.json());
    //     }

    //get files from server
    //should map to /list
    getFiles() {
        const urlConst = `${this.url.getFilesUrl}?path_id=0`;
        return this.http.get(urlConst)
                .map(res => res.json());
        }

    // deleteFile(id: Number){
    //     const urlConst = `${this.url.deleteFileUrl}/${id}`;
    //     console.log(this.url.deleteFileUrl);
    //     // const url = 'http://127.0.0.1:3000/files/delete/2';
    //     console.log("url of file to be deleted: " + urlConst);
    //     // console.log("ID of file to be deleted: " + newFile);

    //     return this.http.delete(urlConst)
    //     .map(res => res.json());
    // }

    saveFile(id) {
        console.log('Download cliked data service: ' + id);
        let body = `path_id=${id}`;
        var headers = new Headers();
        console.log("in download body : ", body);
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        console.log('Download Link data service -->'+this.url.downloadFileUrl);
        this.http.post(this.url.downloadFileUrl, {
            headers:headers
        }).toPromise()
        .then(response => this.saveToFileSystem(response));
        // return this.http.post(this.url.downloadFileUrl, id).map((res: any) => res.json());
    }

   saveToFileSystem(response){
       console.log("SavetoFileSytems: Response-->"+response)
        const contentDispositionHeader: string = response.headers.get('Content-Disposition');
        const parts: string[] = contentDispositionHeader.split(';');
        const filename = parts[1].split('=')[1];
        const blob = new Blob([response._body], {type: 'text/plain'});

        saveAs(blob, filename);
        console.log("file name: " + filename + " downloaded!");

    }

}
