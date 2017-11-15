import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
// const parseJson = require('parse-json');
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  folder: Folder[];

  constructor(private dataservice:DataService) {
    console.log('Constructor ran...')

   }

  ngOnInit() {
    console.log('ngOnInit ran successfuly ...');
    this.dataservice.getFolder().subscribe((folders) => {
      // console.log(JSON.parse(posts));


      this.folder = JSON.parse(folders);
    });
  }



};

interface Folder{
  id:Number,
  parent_id: Number,
  name: String,
  path: String,
  fileType:Number,
  size:Number


}
