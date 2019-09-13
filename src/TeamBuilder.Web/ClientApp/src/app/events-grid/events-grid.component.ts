import { Component, OnInit, Inject } from '@angular/core';
import { GridOptions } from "ag-grid-community";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'events-grid',
  templateUrl: './events-grid.component.html',
  styleUrls: ['./events-grid.component.css']
})
export class EventsGridComponent implements OnInit {
  teamEvents: any;
  gridOptions = <GridOptions> {
    enableRangeSelection: true,
    columnDefs: [
      { headerName: "Name", field: "name", width: 150 },
      { headerName: "Location", field: "location", width: 100 },
      { headerName: "Status", field: "status", width: 80},
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

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL')
    private baseUrl: string) { }

  ngOnInit() {
    this.teamEvents = this.http.get(this.baseUrl + 'api/teamevents');
  }
}
