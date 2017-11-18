import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {NgForm, FormGroupDirective, FormControl} from '@angular/forms';
import {saveAs } from 'file-saver/Filesaver';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

interface Folder {
    id: Number,
    parent_id: Number,
    name: String,
    path: String,
    fileType: Number,
    size: Number
}


interface NewFile {
    id: Number,
    parent_id: Number,
    name: String,
    path: String,
    fileType: Number,
    size: Number
}

// const parseJson = require('parse-json');
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    private fileName: string = 'Select a file';
    private folderName: string = 'Select a folder';
    private fileSize: number;
    private folderSize: number;
    private filePath: any;
    private folderPath: string;
    public newFile: NewFile;
    public folder: Folder;
    public folders: Folder[];
   

    constructor(private dataservice: DataService, private http:Http ) {
        console.log('Constructor ran...')

    }
    
    retrieveFileData(event) {
        if (event.target.files[0]) {
            this.fileName = event.target.files[0].name;
            this.fileSize = event.target.files[0].size;
            this.filePath = URL.createObjectURL(event.target.files[0]);
            var reader = new FileReader();
            reader.onload = (loadEvent: any = {}) => {
                this.newFile.path = this.filePath;
                this.newFile.name = this.fileName;
                this.newFile.fileType = 0;
                this.newFile.size = this.fileSize;
                console.log(this.newFile);
            };
            reader.readAsDataURL(event.target.files[0]);
        } else {
            this.fileName = 'Select a file';
            this.newFile.path = '';
        }
    }

    retrieveFolderData(event) {
        if (event.target.files) {
            this.folderName = '1 folder selected';
            this.folderPath = URL.createObjectURL(event.target.files[0]);
            this.folder.path = this.folderPath;
            this.folder.name = this.folderName;
            this.folder.fileType = 1;
            console.log(this.folder.path);
        } else {
            this.fileName = 'Select a file';
            this.folder.path = '';
        }
    }

    ngOnInit() {
        console.log('ngOnInit ran successfuly ...');
        this.dataservice.getFiles().subscribe((folder) => {
            // console.log(JSON.parse(posts));

            this.folder = JSON.parse(folder);
        });

        this.newFile = {
            id: null,
            parent_id: null,
            name: '',
            path: '',
            fileType: null,
            size: null
        }
        this.folder = {
            id: null,
            parent_id: null,
            name: '',
            path: '',
            fileType: null,
            size: null
        }

    }
    //needs a rethink
    onClickFolder(folder: Folder) {
        console.log("folder was clicked successfully");
        this.dataservice.getFile(this.folder.id).subscribe((folders) => {
            // console.log(JSON.parse(posts));


            this.folder = JSON.parse(folders);
        });

    };

    onClickUpload(): void {

        function removeEmpty(obj) {
            Object.keys(obj).forEach(function (key) {
                (obj[key] && typeof obj[key] === 'object') &&
                removeEmpty(obj[key]) || (obj[key] === '' || obj[key] === null) &&
                delete obj[key]
            });
            return obj;
        }

        let payload1 = JSON.stringify(removeEmpty(this.newFile));
        let payload2 = JSON.stringify(removeEmpty(this.folder));

        console.log("this is payload:" + payload1 + payload2);

        this.dataservice.postFile(payload1)
            .subscribe(
                (res: any) => {
                    console.log("file upload successful:", res);
                },
                (error: any) => {
                    console.log("thrown error", error);
                }
            );
        this.dataservice.postFolder(payload2)
            .subscribe(
                (res: any) => {
                    console.log("folder upload successful:", res);
                },
                (error: any) => {
                    console.log("thrown error", error);
                }
            )
    };

    onFileDeleteClick(id) {
        console.log("deleting " + id);
        this.dataservice.deleteFile(id).subscribe(res => {
            console.log(res);
            for(let i = 0; i < this.folders.length; i++){
                if(this.folders[i].id == id){
                    this.folders.splice(i,1);
                }
            }
            
        });
    }
    //save file to disk
    //https://shekhargulati.com/2017/07/16/implementing-file-save-functionality-with-angular-4/
    saveFile() {
        console.log('Download cliked: ');
        const headers = new Headers();
        headers.append('Accept', 'text/plain');
        this.http.get('/api/files', {
            headers:headers
        }).toPromise()
        .then(response => this.saveToFileSystem(response));
    }

   saveToFileSystem(response){
        const contentDispositionHeader: string = response.headers.get('Content-Disposition');
        const parts: string[] = contentDispositionHeader.split(';');
        const filename = parts[1].split('=')[1];
        const blob = new Blob([response._body], {type: 'text/plain'});

        saveAs(blob, filename);
        console.log("file name: " + filename + " saved!");
        
    }


};
