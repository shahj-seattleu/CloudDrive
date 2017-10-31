import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Post[];

  constructor(private dataservice:DataService) {
    console.log('Constructor ran...')

   }

  ngOnInit() {
    console.log('ngOnInit ran successfuly ...');
    this.dataservice.getPosts().subscribe((posts) => {
      //console.log(posts);
      this.posts = posts;
    });
  }


  
};

interface Post{
  id: Number,
  title: String,
  body: String,
  
}