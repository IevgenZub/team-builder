import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'event-registration-component',
  templateUrl: './event-registration.component.html'
})
export class EventRegistrationComponent {
  private eventForm;
  public teamEvents: any;
  public columnDefs = [
    { headerName: 'Name', field: 'name', resizable: true },
    { headerName: 'Location', field: 'location', resizable: true }
  ];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, formBuilder: FormBuilder) {
    this.eventForm = formBuilder.group({
      name: '',
      location: ''
    });
  }

  ngOnInit() {
    this.teamEvents = this.http.get(this.baseUrl + 'api/teamevents');
  }

  onSubmit(eventData) {
    this.http.post<EventRegistration>(this.baseUrl + 'api/teamevents', eventData).subscribe(
      //result => this.teamEvents.push(result),
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

