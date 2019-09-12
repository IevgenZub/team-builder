import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridOptions } from "ag-grid-community";
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'event-registration-component',
  templateUrl: './event-registration.component.html'
})
export class EventRegistrationComponent {
  faCheck = faCheck;
  faEdit = faEdit;
  teamEvents: any;
  gridOptions = <GridOptions>{
    enableRangeSelection: true,
    columnDefs: [
      { headerName: "Name", field: "name", width: 150 },
      { headerName: "Location", field: "location", width: 100 },
      { headerName: "Status", field: "status", width: 80 },
      { headerName: "Created", field: "createDate", width: 100, cellRenderer: (data) => new Date(data.value).toLocaleString() },
      { headerName: "Start", field: "startDate", width: 100, cellRenderer: (data) => new Date(data.value).toLocaleString() }
    ],
    defaultColDef: { sortable: true, resizable: true, filter: true },
    deltaRowDataMode: true,
    getRowNodeId: function (data) {
      return data.id;
    },
    onGridReady: () => {
      this.teamEvents.subscribe(rowData => this.gridOptions.api.setRowData(rowData));
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit();
      params.api.setSortModel([{ colId: 'createDate', sort: 'desc' }]);
    }
  };
  newEvent = <EventRegistration> {};
  eventForm = this.formBuilder.group({
    name: new FormControl(this.newEvent.name, [Validators.required, Validators.minLength(3)]),
    location: '',
    startDate: '',
    startTime: ''
  });

  get name() { return this.eventForm.get('name'); }

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL')
    private baseUrl: string,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.teamEvents = this.http.get(this.baseUrl + 'api/teamevents');
  }

  onSubmit(eventData) {
    this.http.post<EventRegistration>(this.baseUrl + 'api/teamevents', eventData).subscribe(
      result => this.gridOptions.api.updateRowData({ add: [result] }),
      error => console.error(error)
    );

    this.eventForm.reset();
  }
}

interface EventRegistration {
  id: number;
  name: string;
  location: string;
  startDate: Date;
}

