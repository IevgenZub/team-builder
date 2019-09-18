import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { AuthorizeService } from '../../api-authorization/authorize.service';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  id: string;
  userName: string;
  isAuthenticated: boolean;
  teamEvent: any;
  faPlus = faPlus;
  faMinus = faMinus;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private authorizeService: AuthorizeService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id: Observable<string> = this.route.params.pipe(map(p => p.id));
    this.authorizeService.isAuthenticated().subscribe(result => this.isAuthenticated = result);
    this.authorizeService.getUser().pipe(map(u => u && u.name)).subscribe(user => {
      id.subscribe(result => {
        this.id = result;
        this.userName = user;
        this.http.get(this.baseUrl + 'api/teamevents/' + result).subscribe(
          data => this.teamEvent = data,
          error => console.error(error))
      });
    });
  }

  attend(id: number) {
    if (this.isAuthenticated) {
      let teamEvent = this.teamEvent;
      let attendees = [];
      if (teamEvent.attendees) {
        attendees = JSON.parse(teamEvent.attendees);
      }

      if (attendees.filter(a => a.email == this.userName).length == 0) {
        attendees.push({ email: this.userName });
        var updateRequest = {
          name: teamEvent.name,
          location: teamEvent.location,
          description: teamEvent.description,
          ticketPrice: teamEvent.ticketPrice,
          locationMapUrl: teamEvent.locationMapUrl,
          startDate: new Date(teamEvent.startDate),
          startTime: {
            hour: new Date(teamEvent.startDate).getHours(),
            minute: new Date(teamEvent.startDate).getMinutes()
          },
          minAttendees: teamEvent.minAttendees,
          maxAttendees: teamEvent.maxAttendees,
          locationImageUrl: teamEvent.locationImageUrl,
          logoImageUrl: teamEvent.logoImageUrl,
          attendees: JSON.stringify(attendees),
          categories: teamEvent.categories,
          photos: teamEvent.photos,
          comments: teamEvent.comments,
          reviews: teamEvent.reviews
        }

        this.http.put(this.baseUrl + 'api/teamevents/' + id, updateRequest).subscribe(
          () => teamEvent.attendees = JSON.stringify(attendees),
          error => console.error(error)
        );
      }
    }
  }

  discard(id: number) {
    if (this.isAuthenticated) {
      let teamEvent = this.teamEvent;
      let attendees = [];
      if (teamEvent.attendees) {
        attendees = JSON.parse(teamEvent.attendees);
        const index: number = attendees.findIndex(a => a.email == this.userName);
        if (index !== -1) {
          attendees.splice(index, 1);
        }
      }

      var updateRequest = {
        name: teamEvent.name,
        location: teamEvent.location,
        description: teamEvent.description,
        ticketPrice: teamEvent.ticketPrice,
        locationMapUrl: teamEvent.locationMapUrl,
        startDate: new Date(teamEvent.startDate),
        startTime: {
          hour: new Date(teamEvent.startDate).getHours(),
          minute: new Date(teamEvent.startDate).getMinutes()
        },
        minAttendees: teamEvent.minAttendees,
        maxAttendees: teamEvent.maxAttendees,
        locationImageUrl: teamEvent.locationImageUrl,
        logoImageUrl: teamEvent.logoImageUrl,
        attendees: JSON.stringify(attendees),
        categories: teamEvent.categories,
        photos: teamEvent.photos,
        comments: teamEvent.comments,
        reviews: teamEvent.reviews
      }

      this.http.put(this.baseUrl + 'api/teamevents/' + id, updateRequest).subscribe(
        () => teamEvent.attendees = JSON.stringify(attendees),
        error => console.error(error)
      );
    }
  }

  onSubmitComment(eventData) {

    // TODO: Add service TeamEventService call to send comment

    this.http.put(this.baseUrl + 'api/teamevents/' + this.id, eventData).subscribe(
      () => console.warn(eventData),
      error => console.error(error)
    );
  }
}
