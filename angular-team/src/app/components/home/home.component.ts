import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {NgForm, FormGroupDirective, FormControl} from '@angular/forms';
import {saveAs } from 'file-saver/Filesaver';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

interface Folder {
    path_id: Number,
    parent_id: Number,
    name: String,
    file_path: String,
    fileType: Number,
    size: Number
}


interface NewFile {
    path_id: Number,
    parent_id: Number,
    name: String,
    file_path: String,
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
    public parentid: Number;
    
    constructor(private dataservice: DataService, private http:Http ) {
        this.parentid=0;
    }

    removeFileData(id) {
                this.newFile.path_id=id;
    }

    retrieveFileData(event) {
        if (event.target.files[0]) {
            this.fileName = event.target.files[0].name;
            this.fileSize = event.target.files[0].size;
            this.filePath = URL.createObjectURL(event.target.files[0]);
            console.log('fileName',this.filePath);
            var reader = new FileReader();
            reader.onload = (loadEvent: any = {}) => {
                this.newFile.path_id=0;
                this.newFile.file_path = this.filePath;
                
            };
            reader.readAsDataURL(event.target.files[0]);
        } else {
            this.fileName = 'Select a file';
            this.newFile.file_path = '';
        }
    }

    retrieveFolderData(event) {
        if (event.target.files) {
            this.folderName = '1 folder selected';
            this.folderPath = URL.createObjectURL(event.target.files[0]);
            this.folder.file_path = this.folderPath;
            this.folder.name = this.folderName;
            this.folder.fileType = 1;
            console.log(this.folder.file_path);
        } else {
            this.fileName = 'Select a file';
            this.folder.file_path = '';
        }
    }

    ngOnInit() {
        console.log('ngOnInit ran successfuly ...');
        this.dataservice.getFiles().subscribe((folder) => {


            this.folders = JSON.parse(folder);
            console.log(this.folders);
        });

        this.newFile = {
            path_id: null,
            parent_id: null,
            name: '',
            file_path: '',
            fileType: null,
            size: null
        }
        this.folder = {
            path_id: null,
            parent_id: null,
            name: '',
            file_path: '',
            fileType: null,
            size: null
        }

    }

    //Upload File or folder
    onClickUpload(): void {

        function removeEmpty(obj) {
            Object.keys(obj).forEach(function (key) {
                (obj[key] && typeof obj[key] === 'object') &&
                removeEmpty(obj[key]) || (obj[key] === '' || obj[key] === null) &&
                delete obj[key]
            });
            return obj;
        }

        console.log('File:',this.newFile.file_path);
        this.dataservice.postFile(this.newFile.file_path);
    };

    //Delete file or folder
    onDeleteClick(id):void{
        this.dataservice.deleteFolder(id);
    };

    // save file to disk
    downloadFile(id){
        console.log("downloading ..." + id);
        this.dataservice.saveFile(id);

    }

    //Open folder
    onFolderClick(id){
        console.log("opening ..." + id);
        this.parentid = id-1;
        
        // this.dataservice.getFolder(id);
        this.dataservice.getFolder(id).subscribe((folder) => {


            this.folders = JSON.parse(folder);
            
        });
    }

    //Go back to parent folder
    onBackClick(){

        console.log('parent id'+ this.parentid)
        if(this.parentid!=0){
        this.onFolderClick(this.parentid);
        }
    }
};
