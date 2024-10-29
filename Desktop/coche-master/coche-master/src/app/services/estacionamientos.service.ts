import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EstacionamientosService {
  auth = inject(AuthService);

  // Método para obtener estacionamientos activos
  buscarEstacionamientoActivo(idCochera: number) {
    return fetch(`http://localhost:4000/estacionamientos/${idCochera}`, {
      method: 'GET',
      headers: {
        Authorization: "Bearer " + this.auth.getToken(),
        'Content-Type': 'application/json'
      },
    }).then(response => {
      if (!response.ok) throw new Error('Unauthorized');
      return response.json();
    });
  }

  // Método para estacionar un auto
  estacionarAuto(patente: string, idCochera: number) {
    return fetch(`http://localhost:4000/estacionamientos`, {
      method: 'POST',
      headers: {
        Authorization: "Bearer " + this.auth.getToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ patente, idCochera })
    }).then(response => {
      if (!response.ok) throw new Error('Unauthorized');
      return response.json();
    });
  }
}
