import { Component } from '@angular/core';
import { NavController, NavParams, ViewController , ToastController,Platform, LoadingController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker , ImagePickerOptions } from '@ionic-native/image-picker';
import { CargaArchivoProvider } from '../../providers/carga-archivo/carga-archivo';


@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {

imgPreview:string = "";
imgData:string = "";
titulo:string = "";


  constructor(public viewCtrl: ViewController,
  private camera: Camera, 
  private _cap: CargaArchivoProvider,
  private toastCtrl: ToastController,
  private platform:Platform,
  private loadigCtrl: LoadingController,
  private imagePicker: ImagePicker) {
  }
cerrar_modal(){
  this.viewCtrl.dismiss();
}


  ionViewDidLoad() {
    console.log('ionViewDidLoad SubirPage');
  }



mostrar_toast(text:string){
  this.toastCtrl.create({
    message:text,
    duration:2500
  }).present();
}

abrir_img(){

  if(!this.platform.is("cordova")){
    this.mostrar_toast("no estamos en un movil");
    return;
  }

  let options: ImagePickerOptions = {
    maximumImagesCount: 1,
    quality: 40,
    outputType: 1
  }

  this.imagePicker.getPictures(options).then((results) => {

      for (let img of results){
        this.imgPreview = 'data:image/jpeg;base64,' + img;
        this.imgData = img;
        break;
      }  
}, (err) => { 
  this.mostrar_toast(err);
});
}


abrir_camara(){

  if(!this.platform.is("cordova")){
    this.mostrar_toast("no estamos en un movil");
    return;
  }

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

  this.camera.getPicture(options).then((imageData) => {
  // imageData is either a base64 encoded string or a file URI
  // If it's base64:
  this.imgPreview = 'data:image/jpeg;base64,' + imageData;
  this.imgData = imageData;
  }, (err) => {

    this.mostrar_toast(err);
  // Handle error
  });
}

crear_post(){

let post = {
  text:this.titulo,
  img: this.imgData
}

var loading = this.loadigCtrl.create({
  content:" Cargando Imagenes"
});
loading.present();

this._cap.cargar_imagen_firebase(post)
  .then(
  () => {
    console.log("entro ");
    loading.dismiss();
  },
  (erro) =>{
    console.log(JSON.stringify(erro));
    this.mostrar_toast(JSON.stringify(erro));
  }
);

}

}
