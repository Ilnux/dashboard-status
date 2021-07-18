import {Component, OnInit} from '@angular/core';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import {StatusService} from "../../servicios/status.service";
import {DashboardStatus} from "../../interfaces/dashboardStatus.interface";
import {alto, bajo, medio} from "../../variablesGlobales";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  circulo = faCircle;
  porcentajeTraking: number = 0;
  porcentajesigoApp: number = 0;
  dashboardStatus!: DashboardStatus;
  colorIconoTraking: string = "";
  colorIconoSigoApp: string = "";

  constructor(private servicioStatus: StatusService) {
    this.consumoInicial();
  }

  ngOnInit(): void {

    setInterval(() => {
      this.consumoInicial();
    }, 3000);
  }

  establecerColor(color: number): string {
    if (color >= alto.min) {
      return alto.color;
    } else {
      if (color >= medio.min && color <= medio.max) {
        return medio.color;
      } else if (color >= bajo.min && color <= bajo.max) {
        return bajo.color;
      }
    }
    return "red";
  }


  consumoInicial(): void {
    this.servicioStatus.obtenerStatus()
      .subscribe((data: DashboardStatus) => {
        this.dashboardStatus = data;
        console.log(data)
        this.estadoApis();

        this.porcentajeTraking = this.sacarPorcentaje(this.dashboardStatus.status.apis[0].tracking.days);
        this.porcentajesigoApp = this.sacarPorcentaje(this.dashboardStatus.status.apis[1].authenticacion.days);

        console.log("Trakcking: "+this.porcentajeTraking);
        console.log("sigoApp: "+this.porcentajesigoApp);
      });
  }

  estadoApis(): void {
    if (this.dashboardStatus.status.apis[0].tracking.current_status === "up") {
      this.colorIconoTraking = "fondo-icon-azul";
    } else {
      this.colorIconoTraking = "fondo-icon-rojo";
    }

    if (this.dashboardStatus.status.apis[1].authenticacion.current_status === "up") {
      this.colorIconoSigoApp = "fondo-icon-azul";
    } else {
      this.colorIconoSigoApp = "fondo-icon-rojo";
    }
  }

  sacarPorcentaje(lista: number[]) {
    let acumulador = 0;
    lista.forEach(dia => {
      acumulador = acumulador + dia;
    })
    return acumulador/lista.length
  }

}
