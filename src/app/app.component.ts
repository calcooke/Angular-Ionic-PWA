import { Component, OnInit } from '@angular/core';

import { Platform, ToastController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private swUpdate: SwUpdate
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {

    //If the service worker is enabled
    if (this.swUpdate.isEnabled) {

      // 'available' is an update available event. It emits whenever a new
      // app version is available, and we subscribe to it.
      //The service worker will check this in the backgroud and notify us.
      this.swUpdate.available.subscribe(async () => {

        const alert = await this.alertCtrl.create({


          header: 'Update now',
          message: 'Refresh your app to get an updated version',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            }, {

              text: 'Update',
              handler: () => {

                window.location.reload();

              },

            }
          ]

        });


        await alert.present();

      });

    }

  }
}
