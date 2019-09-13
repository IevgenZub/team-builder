import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  template: '<div style="cursor:pointer;" class="text-center"><fa-icon (click)="navigate()" [icon]="faEdit"></fa-icon></div>'
})
export class ActionCellLinkRendererComponent implements ICellRendererAngularComp {
  params: any;
  faEdit = faEdit;

  constructor(
    private ngZone: NgZone,
    private router: Router) { }

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return false;
  }

  navigate() {
    this.ngZone.run(() => this.router.navigate(['register-event'], { queryParams: {id: this.params.value }}));
  }
}
