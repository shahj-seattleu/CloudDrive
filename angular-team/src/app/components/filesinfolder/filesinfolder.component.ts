import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-filesinfolder',
  templateUrl: './filesinfolder.component.html',
  styleUrls: ['./filesinfolder.component.css']
})
export class FilesinfolderComponent implements OnInit {

  newfile: NewFile[];

  constructor(private dataservice:DataService) { 
    console.log('files in folder ran');
    
  }

  ngOnInit() {

    console.log('files in folder ngOnInit ran successfuly ...');
    
  }

}


interface NewFile{
  id:Number,
  parent_id: Number,
  name: String,
  path: String,
  fileType:Number,
  size:Number


}

