import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { Subscription, fromEvent } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { Plugins, CameraResultType} from '@capacitor/core';
const {Geolocation, Camera} = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  users = [];
  name= null;
  appIsOnline = true;
  coordinates = null;
  image = null;

  //Storing subscriptions as a variable
  browserOffline: Subscription;
  browserOnline: Subscription;

  constructor(private swUpdate: SwUpdate, private http: HttpClient, private sanitizer: DomSanitizer) {

    //Subscribe to the offline event of the window, and set it to the browserOffline subscription
    this.browserOffline = fromEvent(window, 'offline').subscribe(() =>{

      //Set the appIsOnline boolean accordingly
      this.appIsOnline = false;
    });

    //Repeat for the window's online event
    this.browserOnline = fromEvent(window, 'online').subscribe(() =>{

      //Set the appIsOnline boolean accordingly
      this.appIsOnline = true;
    })


  }

  async getCurrentPosition() {
    this.coordinates = await Geolocation.getCurrentPosition();
    console.log('Current', this.coordinates);
  }

  async capture(){

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    
    console.log('image: ', image);

    //Make sure we have an image and image web path before we sanitize and display it
    this.image = this.sanitizer.bypassSecurityTrustResourceUrl(image && image.webPath);

  }

  getData(){

    this.http.get('https://randomuser.me/api/?results=5').subscribe(result => {

    console.log('results: ', result);

    this.users = result['results'];

    });

  }

  getOnlineData(){

    this.http.get('http://dummy.restapiexample.com/api/v1/employees').subscribe(result => {

    console.log('name result: ', result['data'][0]['employee_name']);
    this.name = result['data'][0]['employee_name'];

    });

  }

  checkUpdate(){

    this.swUpdate.checkForUpdate();

  }

}
