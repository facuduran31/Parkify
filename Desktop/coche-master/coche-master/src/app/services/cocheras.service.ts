import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Cochera } from '../interfaces/cochera';

@Injectable({
  providedIn: 'root'
})

export class CocherasService {

  auth = inject(AuthService);

  cocheras() {
    return fetch('http://localhost:4000/cocheras', {
      method: 'GET',
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? '')
      },
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Error: Unauthorized or other server issue.");
    }).catch(error => {
      console.error(error);
      return null; // Maneja el error devolviendo `null` o lanza un error específico según sea necesario
    });
  }

  agregarCochera(cochera: Cochera) {
    console.log(this.auth.getToken());
    return fetch('http://localhost:4000/cocheras', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + (this.auth.getToken() ?? '')
      },
      body: JSON.stringify(cochera)
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Error: Unauthorized or other server issue.");
    }).catch(error => {
      console.error(error);
      return null;
    });
  }
}
