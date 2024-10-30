import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cochera';
import { HeaderComponent } from "../../components/header/header.component";
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { EstacionamientosService } from '../../services/estacionamientos.service';
import { CocherasService } from '../../services/cocheras.service';

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './estado-cocheras.component.html',
  styleUrl: './estado-cocheras.component.scss'
})

export class EstadoCocherasComponent {
  titulo = 'ESTADO DE COCHERAS';
  header = {
    nro: 'Nro',
    disponibilidad: 'Disponibilidad',
    ingreso: 'Ingreso',
    acciones: 'Acciones',
  };

  filas: Cochera[] = [];
  siguienteNumero: number = 1;
  auth = inject(AuthService);
  cocheras = inject(CocherasService);
  estacionamientos = inject(EstacionamientosService);

  async agregarFila() {
    const nuevaCochera: Cochera = {
      descripcion: 'Nueva Cochera', // Puedes ajustar la descripción
      id: this.siguienteNumero,
      deshabilitada: false,
      eliminada: false,
      activo: false
    };

    try {
      // Persistencia en la base de datos usando el servicio de cocheras
      await this.cocheras.agregarCochera(nuevaCochera);

      // Si se agregó exitosamente en la base de datos, actualizar la interfaz
      this.filas.push(nuevaCochera);
      this.siguienteNumero += 1;
    } catch (error) {
      console.error('Error al agregar la cochera en la base de datos:', error);
      Swal.fire('Error', 'No se pudo agregar la cochera en la base de datos.', 'error');
    }
  }

  eliminarFila(index: number, event: Event) {
    event.stopPropagation();
    
    const cocheraId = this.filas[index].id; // Obtén el ID de la cochera a eliminar
  
    // Confirma la eliminación antes de proceder
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez eliminada, no podrás recuperar esta cochera.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Eliminar la cochera en la base de datos
          await this.cocheras.eliminarCochera(cocheraId);
          
          // Luego eliminar la cochera de la lista en la interfaz
          this.filas.splice(index, 1);
          Swal.fire('Eliminada', 'La cochera ha sido eliminada.', 'success');
        } catch (error) {
          console.error('Error al eliminar la cochera en la base de datos:', error);
          Swal.fire('Error', 'No se pudo eliminar la cochera en la base de datos.', 'error');
        }
      }
    });
  }
  

  cambiarDisponibilidadCochera(numeroFila: number, event: Event) {
    event.stopPropagation();
    const cochera = this.filas[numeroFila];
    const opcion: string = cochera.deshabilitada ? "enable" : "disable"; // Determina la opción
  
    this.cocheras.cambiarDisponibilidadCochera(cochera, opcion).then(() => {
      cochera.deshabilitada = !cochera.deshabilitada; // Cambia el estado en la interfaz
    }).catch(error => {
      console.error('Error al actualizar la cochera en la base de datos:', error);
      Swal.fire('Error', 'No se pudo actualizar la disponibilidad de la cochera en la base de datos.', 'error');
    });
  }
  
  

  ngOnInit() {
    this.traerCocheras();
  }

  traerCocheras() {
    return this.cocheras.cocheras().then(cocheras => {
      this.filas = [];

      for (let cochera of cocheras) {
        this.estacionamientos.buscarEstacionamientoActivo(cochera.id).then(estacionamiento => {
          this.filas.push({
            ...cochera,
            activo: estacionamiento,
          });
        });
      }
    });
  }

  abrirModalNuevoEstacionamiento(idCochera: number) {
    Swal.fire({
      title: "Ingrese la patente del vehículo",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "¡Ingrese una patente válida!";
        }
        return;
      }
    }).then(res => {
      if (res.isConfirmed) {
        this.estacionamientos.estacionarAuto(res.value, idCochera).then(() => {
          this.traerCocheras();
        }).catch(error => {
          console.error("Error al abrir el estacionamiento:", error);
        });
      }
    });
  }
  
}
