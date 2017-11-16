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

<<<<<<< HEAD
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
  
=======
  onDownload(post: Post) {
    console.log('onDownload pressed');
    this.dataservice.downloadFile(post.id).subscribe((status) => {
      console.log('status:', status);
    });
  }

>>>>>>> f6b15f3541261d651e388d2c75a01a96de1163b8


};

<<<<<<< HEAD
interface Folder{
  id:Number,
  parent_id: Number,
  name: String,
  path: String,
  fileType:Number,
  size:Number


}
interface NewFile{
  id:Number,
=======
interface Post {
  id: Number,
>>>>>>> f6b15f3541261d651e388d2c75a01a96de1163b8
  parent_id: Number,
  name: String,
  path: String,
  fileType: Number,
  size: Number


}

