import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService
    ) { }

  ngOnInit(): void {
      this.cargarUsuarios();
      this._modalUploadService.notificacion.subscribe(resp=>{
        this.cargarUsuarios();
      });
  }

  mostrarModal(id: string){
    this._modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios(){
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde)
          .subscribe((resp:any)=>{
            this.usuarios = resp.usuarios;
            this.totalRegistros = resp.total;
            this.cargando = false;
          });
  }

  cambiarDesde(n: number){
    if ((this.desde+n) >= this.totalRegistros) {
      return;
    }
    if ((this.desde+n) <0){
      return;
    }
    this.desde += n;
    this.cargarUsuarios();
  }

  buscarUsuario(termino:string){
    if(termino === ""){
      this.desde = 0;
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    this._usuarioService.buscarUsuarios(termino)
            .subscribe((resp:any)=>{
              this.usuarios = resp.usuarios;
              this.cargando = false;
              }
            );

  }

  borrarUsuario(usuario: Usuario){
      if(this._usuarioService.usuario._id == usuario._id){
        console.log("No se puede borrar a sí mismo");
        return;
      }

      this.cargando = true;
      this._usuarioService.borrarUsuario(usuario._id)
            .subscribe((resp)=>{
                this.cargarUsuarios();
            });

  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario)
        .subscribe();
  }

}
