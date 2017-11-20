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
        console.log('Constructor ran...')

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
            var reader = new FileReader();
            reader.onload = (loadEvent: any = {}) => {
                // this.newFile.path = this.filePath;
                this.newFile.path_id=0;
                this.newFile.file_path = "/Users/kanav/Downloads/mean-concept.png";
                // this.newFile.name = this.fileName;
                // this.newFile.fileType = 0;
                // this.newFile.size = this.fileSize;
                console.log(this.newFile);
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
    // //needs a rethink
    // onClickFolder(folder: Folder) {
    //     console.log("folder was clicked successfully" + folder.name);
    //     this.dataservice.getFile(this.folder.path_id).subscribe((folders) => {
    //         // console.log(JSON.parse(posts));


    //         this.folder = JSON.parse(folders);
    //     });

    // };

    onClickUpload(): void {

        function removeEmpty(obj) {
            Object.keys(obj).forEach(function (key) {
                (obj[key] && typeof obj[key] === 'object') &&
                removeEmpty(obj[key]) || (obj[key] === '' || obj[key] === null) &&
                delete obj[key]
            });
            return obj;
        }

        // let payload1 = JSON.stringify(removeEmpty(this.newFile));
        // let payload2 = JSON.stringify(removeEmpty(this.folder));

        // console.log("this is payload:" + payload1 + payload2);
        console.log('File:',this.newFile.file_path);
        this.dataservice.postFile(this.newFile.file_path);

        // this.dataservice.postFile(payload1)
        //     .subscribe(
        //         (res: any) => {
        //             console.log("file upload successful:", res);
        //         },
        //         (error: any) => {
        //             console.log("thrown error", error);
        //         }
        //     );
        // this.dataservice.postFolder(this.newFile)
        //     .subscribe(
        //         (res: any) => {
        //             console.log("folder upload successful:", res);
        //         },
        //         (error: any) => {
        //             console.log("thrown error", error);
        //         }
        //     )
    };
//Should get id and make a JSON with only path_id to let service delete file sonly with that id
    onDeleteClick(id,filetype):void{
          this.newFile.path_id=id;
          this.newFile.file_path = "";
          this.newFile.name = "";
          this.newFile.fileType = null;
          this.newFile.size = null;
          console.log(this.newFile);
          console.log("filetype->"+filetype);
     function removeEmpty(obj) {
        Object.keys(obj).forEach(function (key) {
            (obj[key] && typeof obj[key] === 'object') &&
            removeEmpty(obj[key]) || (obj[key] === '' || obj[key] === null) &&
            delete obj[key]
        });
        return obj;
    }

    // let payload1 = JSON.stringify(removeEmpty(this.newFile));
    // let payload2 = JSON.stringify(removeEmpty(this.folder));

    const request ={path_id: id};
    // let request = JSON.stringify(removeEmpty(payLoad)) ;

    console.log("this is payload:" , request);

    this.dataservice.deleteFolder(request)
        .subscribe(
            (res: any) => {
                console.log("file upload successful:", res);
            },
            (error: any) => {
                console.log("thrown error", error);
            }
        );
    this.dataservice.deleteFolder(request)
        .subscribe(
            (res: any) => {
                console.log("folder upload successful:", res);
            },
            (error: any) => {
                console.log("thrown error", error);
            }
        )
};


        // console.log("delete button clicked");

        // console.log("deleting " + newFile);
        // this.dataservice.deleteFile(newFile).subscribe(res => {
        //     console.log(res);
        //     for(let i = 0; i < this.folders.length; i++){
        //         if(this.folders[i].path_id == newFile){
        //             this.folders.splice(i,1);
        //         }
        //     }

        // });
    // }

    // save file to disk
    downloadFile(id){
        console.log("downloading ..." + id);
        this.dataservice.saveFile(id);

    }


 //       let res = this.dataservice.saveFile(payload2)
//       this.dataservice.saveFile(payload1)
//           .subscribe(
//               (res: any) => {
//                   console.log("file upload successful:", res);
//               },
//               (error: any) => {
//                   console.log("thrown error", error);
//               }

//           );
//       let res2 = this.dataservice.saveFile(payload2)
//           .subscribe(
//               (res: any) => {
//                   console.log("folder upload successful:", res);
//               },
//               (error: any) => {
//                   console.log("thrown error", error);
//               }
//           )
//           this.dataservice.saveToFileSystem(res);
//   };



    onFolderClick(id){
        console.log("opening ..." + id);
        this.parentid = id-1;
        // this.dataservice.getFolder(id);
        this.dataservice.getFolder(id).subscribe((folder) => {


            this.folders = JSON.parse(folder);
            console.log(this.folders);
        });
    }

    onBackClick(){

        console.log('parent id'+ this.parentid)
        if(this.parentid!=0){
        this.onFolderClick(this.parentid);
        }
    }
};
