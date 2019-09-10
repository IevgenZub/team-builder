import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'event-registration-component',
  templateUrl: './event-registration.component.html'
})
export class EventRegistrationComponent {
  eventForm;
    
  constructor(private formBuilder: FormBuilder, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
      this.eventForm = formBuilder.group({
        name: '',
        location: ''
      });
  }

  public onSubmit(eventData) {
    console.warn('Your event has been submitted', eventData);
    this.http.post<EventRegistration>(this.baseUrl + 'teamevents', eventData);
    this.eventForm.reset();
  }
}

interface EventRegistration {
  name: string;
  location: string;
}

