import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DashboardStatus} from "../interfaces/dashboardStatus.interface";

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private URL = "https://us-central1-cm-devops-294019.cloudfunctions.net/";

  constructor(private http: HttpClient) {

  }

  obtenerStatus(): Observable<DashboardStatus> {
    return this.http.get<DashboardStatus>(`${this.URL}status`);
  }

}
