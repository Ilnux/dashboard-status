export interface DashboardStatus {
  last_updated: Date;
  status:       Status;
}

export interface Status {
  apis: API[];
}

export interface API {
  tracking:       Authenticacion;
  authenticacion: Authenticacion;
}

export interface Authenticacion {
  title:          string;
  current_status: string;
  days:           number[];
}
