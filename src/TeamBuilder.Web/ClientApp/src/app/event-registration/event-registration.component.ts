import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GridOptions } from "ag-grid-community";

@Component({
  selector: 'event-registration-component',
  templateUrl: './event-registration.component.html'
})
export class EventRegistrationComponent {
  gridOptions: GridOptions;
  teamEvents: any;
  newEvent = <EventRegistration>{};
  eventForm = this.formBuilder.group({
    name: new FormControl(this.newEvent.name, [
      Validators.required,
      Validators.minLength(3)
    ]),
    location: '',
    startDate: ''
  });

  get name() { return this.eventForm.get('name'); }

  private createColumnDefs() {
    return [
      { headerName: "Name", field: "name", width: 150 },
      {
        headerName: "Location", field: "location", width: 100
      },
      {
        headerName: "Owner", field: "owner", width: 100
      },
      {
        headerName: "Created", field: "createDate", width: 100,
        cellRenderer: (data) => {
          return new Date(data.value).toLocaleDateString();
        }
      },
      {
        headerName: "Start", field: "startDate", width: 100,
        cellRenderer: (data) => {
          return new Date(data.value).toLocaleDateString();
        }
      }
    ]
  }

  private createGridOptions() {
    return <GridOptions> {
      enableRangeSelection: true,
      columnDefs: this.createColumnDefs(),
      defaultColDef: { sortable: true, resizable: true, filter: true },
      deltaRowDataMode: true,
      getRowNodeId: function (data) {
        return data.id;
      },
      onGridReady: () => {
        this.teamEvents.subscribe(
          rowData => {
            // the initial full set of data
            // note that we don't need to un-subscribe here as it's a one off data load
            if (this.gridOptions.api) { // can be null when tabbing between the examples
              this.gridOptions.api.setRowData(rowData);
            }
          }
        );
      },
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
        params.api.setSortModel([{ colId: 'createDate', sort: 'desc' }]);
      }
    };
  }

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private formBuilder: FormBuilder) {
    this.gridOptions = this.createGridOptions();
  }

  ngOnInit() {
    this.teamEvents = this.http.get(this.baseUrl + 'api/teamevents');
  }

  onSubmit(eventData) {
    this.http.post<EventRegistration>(this.baseUrl + 'api/teamevents', eventData).subscribe(
      result => {
        if (this.gridOptions.api) {
          this.gridOptions.api.updateRowData({ add: [result]})
        }
      },
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

