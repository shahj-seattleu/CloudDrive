import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {NgForm, FormGroupDirective, FormControl} from '@angular/forms';

@Component({
    selector: 'app-filesinfolder',
    templateUrl: './filesinfolder.component.html',
    styleUrls: ['./filesinfolder.component.css']
})
export class FilesinfolderComponent implements OnInit {

    private fileName: string = 'Select a file';
    public newfile: NewFile[];
    public file: NewFile;

    constructor(private dataservice: DataService) {
        console.log('files in folder ran');
    }


    ngOnInit() {

       /* console.log('files in folder ngOnInit ran successfuly ...');
        this.dataservice.getFile(this.newfile).subscribe((file) => {
            // console.log(JSON.parse(posts));

            this.newfile = JSON.parse(file);
        });*/
    }

}


interface NewFile {
    id: Number,
    parent_id: Number,
    name: String,
    path: String,
    fileType: Number,
    size: Number
}

