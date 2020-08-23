import { Component } from '@angular/core';
import { NavController ,ModalController} from 'ionic-angular';
import { SubirPage } from '../subir/subir';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mascotas: FirebaseListObservable<any[]>;
  constructor( private ModalCtrl: ModalController, afDB: AngularFireDatabase) {
    this.mascotas = afDB.list('/mascotas');
  }
    mostrar_modal(){
      let modal = this.ModalCtrl.create(SubirPage);
      modal.present();
    }
}
