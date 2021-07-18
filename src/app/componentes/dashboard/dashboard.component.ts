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
  porcentajeSigoApp: number = 0;
  porcentajeUltimoMes: number = 0;
  porcentajeUltimaSemana: number = 0;
  porcentajeUltimoDia: number = 0;
  dashboardStatus!: DashboardStatus;
  colorIconoTraking: string = "";
  colorIconoSigoApp: string = "";

  constructor(private servicioStatus: StatusService) {
    this.consumoInicial();
  }

  ngOnInit(): void {

    setInterval(() => {
      this.consumoInicial();
    }, 1000 * 120);
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
        this.estadoApis();

        this.porcentajeTraking = this.obtenerPorcentajeSistema(this.dashboardStatus.status.apis[0].tracking.days);
        this.porcentajeSigoApp = this.obtenerPorcentajeSistema(this.dashboardStatus.status.apis[1].authenticacion.days);
        this.obtenerProcentajesTotales(this.dashboardStatus);

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

  obtenerPorcentajeSistema(lista: number[]) {
    let acumulador = 0;
    lista.forEach(dia => {
      acumulador = acumulador + dia;
    })
    return acumulador / lista.length;
  }

  obtenerProcentajesTotales(dash: DashboardStatus): void {
    this.porcentajeUltimoMes = (this.porcentajeSigoApp + this.porcentajeTraking) / 2;

    let acumulador: number = 0;

    //Porcentaje ultimos 7 dias sigoApp
    for (let i = dash.status.apis[1].authenticacion.days.length; i > 23; i--) {
      acumulador = acumulador + dash.status.apis[1].authenticacion.days[i - 1];
    }
    let porcentajeSigoApp = acumulador / 7;

    acumulador = 0;

    //Porcentaje ultimos 7 dias Tracking
    for (let i = dash.status.apis[0].tracking.days.length; i > 23; i--) {
      acumulador = acumulador + dash.status.apis[0].tracking.days[i - 1];
    }
    let porcentajeTracking = acumulador / 7;

    this.porcentajeUltimaSemana = (porcentajeTracking + porcentajeSigoApp) / 2;
    this.porcentajeUltimoDia = (dash.status.apis[0].tracking.days[29] + dash.status.apis[1].authenticacion.days[29]) / 2;
  }

}
