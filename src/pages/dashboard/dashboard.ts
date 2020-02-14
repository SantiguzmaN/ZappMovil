// import ionic components
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController,AlertController, ViewController,LoadingController  } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


// import component zona zipp
import { ZonaZipp } from '../zona-zipp/zona-zipp';
// model
import { Zona_Zipp } from '../../models/zonazipp';
import { ReservaZona } from '../../models/reservazipp'; 
import { User } from '../../models/user';

// import providers
import { UserService } from '../../providers/user.service';
import { ZippService } from '../../providers/zipp.service';

import { Geolocation } from '@ionic-native/geolocation';

import { GLOBAL } from '../../providers/global';

declare var google;

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  providers: [UserService,ZippService],
})
export class Dashboard {


  @ViewChild('map') mapElement: ElementRef;
  //autocomplete items
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
//geocode items
  latitude: number;
  longitude: number;
  geo: any
  horaLocal:string;
  map: any;
  myLatLng: any;
  lat:number;
  long:number;
  address;
  waypoints: any[];
  public home:boolean;
  public burb:boolean;
  public user: User;
  public reservaszipp: ReservaZona[];
  public identity;
  public url: string;
  public zonaszipp: Zona_Zipp[];

  constructor(public viewCtrl: ViewController, 
              private zone: NgZone,
              public navCtrl: NavController, 
              private _userService: UserService,
              public alertCtrl: AlertController, 
              public loadingCtrl: LoadingController,
              private _zonazippService: ZippService, 
              private geolocation: Geolocation,
              public _http: Http) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.identity = this._userService.getIdentity();
    this.user = this.identity;
    this.url = GLOBAL.url;
    this.home=true;
    this.burb=false;

    this.getUserById();
  }

  ionViewDidLoad() {
    console.log('¡Dashboard cargado!');
    this.identity = this._userService.getIdentity();
    this.getUserById();
    this.initMap();
    this.getZonasZippByUser();
  }

  //metodo para usar el api de google places para autocopletar

  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input, componentRestrictions: {country: 'co'} },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  //Metodo para seleccionar un lugar de la lista
  selectSearchResult(item) {
    this.location = item
    this.geo = item;
    this.geoCode(this.geo);
    this.placeid = this.location.place_id
  }
  GoTo(){
    return window.location.href = 'https://www.google.com/maps/place/?q=place_id:'+this.placeid;
  }
  
  //Metodo para convertir la direccion en coordenadas gps
  geoCode(item) {
    let data=item.place_id;
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({'placeId': data }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
        this.latitude = lat;
        this.longitude = lng;
        this.initMapFilter(this.latitude,this.longitude);
        this.autocompleteItems = [];
        this.autocomplete = { input: '' };
      }else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
      
   });
  }

  //Metodo para desplegar el menu de filtro
  
  
ngDoCheck(){
  	this.identity = this._userService.getIdentity();
  }


   
  initMapFilter(lat:number, lng:number){
    // Obtener geolocalización
     
       
       let latLng = new google.maps.LatLng(lat,lng);
       
       let mapOptions = {
         center: latLng,
         disableDefaultUI: true,
         zoom: 16,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":20},{"color":"#ececec"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"on"},{"color":"#f0f0ef"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#f0f0ef"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#d4d4d4"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"on"},{"color":"#ececec"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21},{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#d4d4d4"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#303030"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.government","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"geometry.stroke","stylers":[{"lightness":"-61"},{"gamma":"0.00"},{"visibility":"off"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#dadada"},{"lightness":17}]}]
       }
       
      
       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 

       //invocación de las zonas zipp al mapa
       this.getZonasZipp();
       
     }
  //metodo para obtener usuariopor id y actualizar los datos
  getUserById(){
    this._userService.getUser(this.user._id).subscribe(
        response => {
            if(!response){
                console.log("no retorno");
            }else{
                this.user = response.user;
                localStorage.setItem('identity', JSON.stringify(this.user));
                                 
            }
        },
        error => {
            console.log(<any>error);
            
        }
    );

  }

 //metodo para obtener las zonas zipp por el id del conductor

  getZonasZippByUser(){
    this._zonazippService.getReservasZippByUser(this.user._id).subscribe(
        response => {
            if(!response.reservas_zipp){
                
            }else{
                this.reservaszipp = response.reservas_zipp;  
                   
            }
        },
        error => {
            console.log(<any>error);
        }
    );
  }
  
  estReserva(estado){
    return this.reservaszipp.filter(y=>y.estado_reserva == estado);
  }
  
  buttonClick(reserva){
    this.navCtrl.setRoot(ZonaZipp, {zonazipp: reserva.zonazipp._id});
  }

  // Display google maps


  initMap(){
   // Obtener geolocalización
    this.geolocation.getCurrentPosition().then((position) => {
      
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
      let mapOptions = {
        center: latLng,
        disableDefaultUI: true,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":20},{"color":"#ececec"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"on"},{"color":"#f0f0ef"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#f0f0ef"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#d4d4d4"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"on"},{"color":"#ececec"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21},{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#d4d4d4"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#303030"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.government","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"geometry.stroke","stylers":[{"lightness":"-61"},{"gamma":"0.00"},{"visibility":"off"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#dadada"},{"lightness":17}]}]
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
      // marcador
      let geoMarker = new google.maps.Marker({
        icon : 'assets/icon/car.png',
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      }); 

      //invocación de las zonas zipp al mapa
      this.getZonasZipp();
      
    }, (err) => {
           console.log(err);
    });
  }

  




  // Metodo para obtener las Zonas ZIPP para refrescar la base de datos
  getZonasZipp(){
    this._zonazippService.getZonasZipp().subscribe(
      (response) => {
        if(!response){
                
        }else{
          this.zonaszipp = response.zonaszipp;
          this.addMarker(this.zonaszipp);
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }


  

  // Método que añade la información a los marcadores de cada zona zipp
  addInfoWindow(zonazipp, content, zona_zipp) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(zonazipp, 'click', () => {
      infoWindow.open(this.map, zonazipp);
    });

    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      document.getElementById('gMaps').addEventListener('click', () => {
        this.gozonazipp(zona_zipp);
      });
    });
    
  }

   
  // Método para añadir los marcadores de las zonas zipp
  addMarker(zonaszipp) {
    for(let zonazipp of zonaszipp) {
       if(zonazipp.estado_zonazipp){
        var position = new google.maps.LatLng(zonazipp.lat, zonazipp.lng);
        var marker_zipp = new google.maps.Marker({
          icon : 'assets/icon/garage.png',
          animation: google.maps.Animation.DROP,
          position: position
        }); 

        marker_zipp.setMap(this.map);

        var content = '<div id="iw-container">' +
                      '<div class="iw-content">'+ 
                        '<p><strong>Dirección: </strong>'+ zonazipp.address + '</p>' + 
                        '<p><strong>Número de espacios: </strong>'+ zonazipp.number_spaces + '</p>' +
                        '<p><strong>Costo por hora: </strong>$'+ zonazipp.price + '</p>' +
                        '<button class="iw-button" id="gMaps" style="background-color: indigo; color:white ;">Ver zona</button>'+
                      '</div>'+
                      '<div class="iw-bottom-gradient"></div>' +
                    '</div>';

        this.addInfoWindow(marker_zipp, content, zonazipp);
      }
    }
  } 
  
  // route to component of zona zipp view
  gozonazipp(zonazipp){
    this.navCtrl.setRoot(ZonaZipp, {zonazipp: zonazipp._id});
  }
  
  Refresh(){
    this.navCtrl.setRoot(Dashboard);
  }
} 