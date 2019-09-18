import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL')
    private baseUrl: string,
) { }

  getTeamEvent(id: number) {
    return this.http.get(this.baseUrl + 'api/teamevents/' + id);
  }

  attend(teamEvent, userName) {
    let attendees = [];
    if (teamEvent.attendees) {
      attendees = JSON.parse(teamEvent.attendees);
    }

    if (attendees.filter(a => a.email == userName).length == 0) {
      attendees.push({ email: userName });
      teamEvent.attendees = JSON.stringify(attendees);
    }

    var updateRequest = this.updateRequest(teamEvent);
    return this.http.put(this.baseUrl + 'api/teamevents/' + teamEvent.id, updateRequest);
  }

  discard(teamEvent, userName) {
    let attendees = [];
    if (teamEvent.attendees) {
      attendees = JSON.parse(teamEvent.attendees);
      const index: number = attendees.findIndex(a => a.email == userName);
      if (index !== -1) {
        attendees.splice(index, 1);
      }
    }

    teamEvent.attendees = JSON.stringify(attendees);
    var updateRequest = this.updateRequest(teamEvent);

    return this.http.put(this.baseUrl + 'api/teamevents/' + teamEvent.id, updateRequest);
  }

  addComment(teamEvent, text, userName) {
    let comments = [];
    if (teamEvent.comments) {
      comments = JSON.parse(teamEvent.comments);
    }

    comments.push({ user: userName, text: text, date: new Date() });
    teamEvent.comments = JSON.stringify(comments);
    var updateRequest = this.updateRequest(teamEvent);

    return this.http.put(this.baseUrl + 'api/teamevents/' + teamEvent.id, updateRequest);
  }

  private updateRequest(teamEvent) {
    return {
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
      attendees: teamEvent.attendees,
      categories: teamEvent.categories,
      photos: teamEvent.photos,
      comments: teamEvent.comments,
      reviews: teamEvent.reviews,
      status: teamEvent.status
    }
  }
}
