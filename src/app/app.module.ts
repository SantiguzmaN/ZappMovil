// ionic components
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


// Providers
import { UserService } from '../providers/user.service';
import { ZippService } from '../providers/zipp.service';
import { GoogleMaps } from '@ionic-native/google-maps';
import { BalanceService } from '../providers/balance.service';
import { Geolocation } from '@ionic-native/geolocation';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


// Import app components 
import { MyApp } from './app.component';
import { UserLogin } from '../pages/user-login/user-login';
import { UserRegister } from '../pages/user-register/user-register';
import { UserTerms } from '../pages/user-terms/user-terms';
import { Payment } from '../pages/payment/payment';
import { Dashboard } from '../pages/dashboard/dashboard';
import { UserEdit } from '../pages/user-edit/user-edit';
import { ZonaZipp } from '../pages/zona-zipp/zona-zipp';


@NgModule({
  declarations: [
    MyApp,
    UserLogin,
    UserRegister,
    UserTerms,
    Dashboard,
    UserEdit,
    ZonaZipp,
    Payment
 
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    UserLogin,
    UserRegister,
    UserTerms,
    Dashboard,
    UserEdit,
    Payment,
    ZonaZipp
  ],
  providers: [
    
    StatusBar,
    SplashScreen,
    EmailComposer,
    InAppBrowser,
    UserService,
    ZippService,
    BalanceService,
    Geolocation,
    
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
