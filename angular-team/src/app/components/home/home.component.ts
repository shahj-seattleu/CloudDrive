import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
// const parseJson = require('parse-json');
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  folder: Folder[];
  newfile: NewFile[];


  constructor(private dataservice: DataService) {
    console.log('Constructor ran...')

  }

  ngOnInit() {
    console.log('ngOnInit ran successfuly ...');
    this.dataservice.getFolder().subscribe((folder) => {
      // console.log(JSON.parse(posts));


      this.folder = JSON.parse(folder);
    });

    
  }

  onClickFolder(folder: Folder){
    console.log("folder was clicked successfully");
    this.dataservice.getFile(folder).subscribe((folders) => {
      // console.log(JSON.parse(posts));


      this.folder = JSON.parse(folders);
    });
    
  };

  onClickUpload(){
    console.log("upload was clicked successfully");
    
    
  };
  onClickDownload(){
    console.log("download was clicked successfully");
    
    
  }
  
  onDownload(folder: Folder) {
    console.log('onDownload pressed');
    
  }



};

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
