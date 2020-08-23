import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {ToastController} from 'ionic-angular';
import 'rxjs/add/operator/map';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';


@Injectable()
export class CargaArchivoProvider {

  private CARPETA_IMAGENES: string = "img";
  private MASCOTAS: string = "mascotas";

  imagenes:any[] = [];
  lastkey:string = null;

  constructor(
    public http: Http,
    public af:AngularFireDatabase,
    public toastCtrl: ToastController
    ) {

    console.log('Hello CargaArchivoProvider Provider');
  }


cargar_imagen_firebase (archivo:archivoSubir){
  let promesa = new Promise((resolve,reject )=>{
      this.mostrar_toast('Iniciando Cargar ...');
      
      let storageRef = firebase.storage().ref();
      let nombre_archivo = new Date().valueOf();  //// nombre unico de archivo identificador

      let uploadTask: firebase.storage.UploadTask = 
        storageRef.child(`${this.CARPETA_IMAGENES}/${nombre_archivo}`)
        .putString(archivo.img,'base64',{contentType:'image/jpeg'});

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        
        (snapshop)=>{ //// saber el progreso del evento

        },
        (erro)=>{  //// manejo de errores 
          this.mostrar_toast(JSON.stringify(erro));

          reject(erro);  //// dio error devuelvo el reject para que el usuario sepa que paso 
        },
        ()=>{   ///// termino el processo 
          let url = uploadTask.snapshot.downloadURL;  /// obtener la url de carga 
          this.mostrar_toast("imagen cargada exitosamente");
          this.crear_post(archivo.text,url);
          resolve();
        }
        
        );



  });
  return promesa;


}

crear_post(texto:string ,url: string ){

  let crear_archivo:archivoSubir = {
    text:texto,
    img:url
  }

  let $key = this.af.database.ref(`${this.MASCOTAS}`).push(crear_archivo).key;
  crear_archivo.$key = $key;

  this.imagenes.push(crear_archivo);


}



mostrar_toast(texto:string){
  this.toastCtrl.create({
    message:texto,
    duration: 2500
  }).present();
}

}

interface archivoSubir{
  $key?:string;
  img:string;
  text:string;
}