import { Component, OnInit } from '@angular/core';
import { SurbirArchivoService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: [
  ]
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imageTemp: string;

  constructor(
    public _subirArchivoService: SurbirArchivoService,
    public _modalUploadService: ModalUploadService) {
  }

  ngOnInit(): void {
  }

  subirImagen(){
      this._subirArchivoService.subirArchivo(this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
          .then(resp=>{
              this._modalUploadService.notificacion.emit(resp);
            this.cerrarModal();
          })
          .catch(resp=>{
              console.log("Error en la carga");
          });
  }

  cerrarModal(){
    this.imageTemp = null;
    this.imagenSubir = null;
    this._modalUploadService.ocultarModal();
  }

  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImageTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => {
      this.imageTemp = reader.result;
    };
  }

}
