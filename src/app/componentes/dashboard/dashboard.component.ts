import {Component, OnInit} from '@angular/core';
import {faCircle} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  circulo = faCircle;

  constructor() {
  }

  ngOnInit(): void {
  }

}
