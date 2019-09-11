import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GridOptions } from "ag-grid-community";

@Component({
  selector: 'event-registration-component',
  templateUrl: './event-registration.component.html'
})
export class EventRegistrationComponent {
  private eventForm: FormGroup;
  public gridOptions: GridOptions;
  public teamEvents: any;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, formBuilder: FormBuilder) {
    this.eventForm = formBuilder.group({
      name: '',
      location: ''
    });

    this.gridOptions = <GridOptions>{
      enableRangeSelection: true,
      columnDefs: this.createColumnDefs(),

      deltaRowDataMode: true,
      getRowNodeId: function (data) {
        // the code is unique, so perfect for the id
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
      }
    };
  }

  private createColumnDefs() {
    return [
      { headerName: "Name", field: "name", width: 280, resizable: true },
      {
        headerName: "Location", field: "location", width: 100, resizable: true,
        cellRenderer: 'agAnimateSlideCellRenderer'
      }
    ]
  }

  numberFormatter(params) {
    if (typeof params.value === 'number') {
      return params.value.toFixed(2);
    } else {
      return params.value;
    }
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
}

