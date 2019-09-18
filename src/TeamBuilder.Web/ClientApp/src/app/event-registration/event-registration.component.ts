import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { faCheck, faEdit, faCalendar, faBackward } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'event-registration',
  templateUrl: './event-registration.component.html'
})
export class EventRegistrationComponent implements OnInit {
  teamEvent = <EventRegistration> {};
  eventForm = this.formBuilder.group({
    name: new FormControl(this.teamEvent.name, [Validators.required, Validators.minLength(3)]),
    categories: new FormControl(this.teamEvent.categories, [Validators.required, Validators.minLength(3)]),
    description:'',
    location: '',
    startDate: '',
    startTime: '',
    logoImageUrl: '',
    locationImageUrl: '',
    minAttendees: '',
    maxAttendees: '',
    attendees: '',
    ticketPrice: '',
    locationMapUrl: '',
    reviews: '',
    photos: '',
    comments: '',
    status: ''
  });

  faCheck = faCheck;
  faEdit = faEdit;
  faCalendar = faCalendar;
  faBackward = faBackward;

  get name() { return this.eventForm.get('name'); }
  get categories() { return this.eventForm.get('categories'); }

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL')
    private baseUrl: string,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private location: Location) { }

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe(params => {
      if (params['id']) {
        this.http.get <EventRegistration>("api/teamevents/" + params['id']).subscribe(result => {
          this.teamEvent =  result;
          if (this.teamEvent.id) {
            this.eventForm.setValue({
              name: this.teamEvent.name,
              location: this.teamEvent.location,
              description: this.teamEvent.description,
              startDate: new Date(this.teamEvent.startDate),
              startTime: {
                hour: new Date(this.teamEvent.startDate).getHours(),
                minute: new Date(this.teamEvent.startDate).getMinutes()
              },
              minAttendees: this.teamEvent.minAttendees,
              maxAttendees: this.teamEvent.maxAttendees,
              logoImageUrl: this.teamEvent.logoImageUrl,
              locationImageUrl: this.teamEvent.locationImageUrl,
              attendees: this.teamEvent.attendees,
              photos: this.teamEvent.photos,
              categories: this.teamEvent.categories,
              reviews: this.teamEvent.reviews,
              ticketPrice: this.teamEvent.ticketPrice,
              comments: this.teamEvent.comments,
              locationMapUrl: this.teamEvent.locationMapUrl,
              status: this.teamEvent.status
            }); 
          }
        });
      }
    });
  }

  onSubmit(eventData) {
    this.activatedRouter.queryParams.subscribe(params => {
      if (params['id']) {
        this.http.put(this.baseUrl + 'api/teamevents/' + params['id'], eventData).subscribe(
          () => this.router.navigate(['/events-grid']),
          error => console.error(error)
        );
      }
      else {
        this.http.post(this.baseUrl + 'api/teamevents', eventData).subscribe(
          () => this.router.navigate(['/events-grid']),
          error => console.error(error)
        );
      }
    });
  }

  navigateBack() {
    this.location.back();
  }
}

interface EventRegistration {
  id: number;
  name: string;
  location: string;
  startDate: Date;
  locationImageUrl: string;
  logoImageUrl: string;
  minAttendees: number;
  maxAttendees: number;
  attendees: string;
  photos: string;
  comments: string;
  reviews: string;
  categories: string;
  ticketPrice: number;
  description: string;
  locationMapUrl: string;
  status: string;
}
