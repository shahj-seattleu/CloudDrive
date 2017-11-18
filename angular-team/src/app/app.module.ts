import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {DataService} from './services/data.service';

import {AppComponent} from './app.component';
import {UserComponent} from './components/user/user.component';
import {AboutComponent} from './components/about/about.component';
import {HomeComponent} from './components/home/home.component';
import {FilesinfolderComponent} from './components/filesinfolder/filesinfolder.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'user', component: UserComponent},
    {path: 'about', component: AboutComponent},
    {path: 'filesinfolder', component: FilesinfolderComponent}

];

@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
        AboutComponent,
        HomeComponent,
        FilesinfolderComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(appRoutes),
        HttpModule
    ],
    providers: [DataService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
