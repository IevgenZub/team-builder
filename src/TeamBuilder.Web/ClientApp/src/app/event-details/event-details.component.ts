import { Component, OnInit, Inject } from '@angular/core';
import { faPlus, faMinus, faThumbsUp, faThumbsDown, faPaperclip, faSmile, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { AuthorizeService } from '../../api-authorization/authorize.service';
import { map} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { EventService } from '../event.service';
import * as signalR from "@aspnet/signalr";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  id: number;
  userName: string;
  isAuthenticated: boolean;
  teamEvent: any;
  faPlus = faPlus;
  faMinus = faMinus;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faPaperclip = faPaperclip;
  faSmile = faSmile;
  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;
  comment = <Comment>{};
  comments = [];
  photos = [];
  entityTypes = [];
  attendees = [];
  commentForm = this.formBuilder.group({
    text: new FormControl(this.comment.text, [Validators.required, Validators.minLength(3)])
  });
  connection: signalR.HubConnection;

  constructor(
    private authorizeService: AuthorizeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private eventService: EventService) {

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/teamEventsHub")
      .build();

    this.connection.on("commentReceived", (username: string, message: string) => {
      this.comments.push({ user: username, text: message, date: new Date() })
    });

    this.connection.start().catch(err => document.write(err));
  }

  ngOnInit(): void {
    const id: Observable<string> = this.route.params.pipe(map(p => p.id));
    this.authorizeService.isAuthenticated().subscribe(result => this.isAuthenticated = result);
    this.authorizeService.getUser().pipe(map(u => u && u.name)).subscribe(user => {
      id.subscribe(result => {
        this.id = Number(result);
        this.userName = user;
        this.eventService.getTeamEvent(this.id).subscribe(
          data => {
            this.teamEvent = data;
            if (this.teamEvent.comments) {
              this.comments = JSON.parse(this.teamEvent.comments);
            }
            if (this.teamEvent.attendees) {
              this.attendees = JSON.parse(this.teamEvent.attendees);
            }
            if (this.teamEvent.photos) {
              this.photos = JSON.parse(this.teamEvent.photos);
              for (var i = 0; i < this.photos.length; i++) {
                var typeName = this.photos[i].type;
                var type = { name: typeName, photos: this.photos.filter(p => p.type == typeName) };
                if (this.entityTypes.filter(e => e.name == typeName).length == 0) {
                  this.entityTypes.push(type);
                }
              }
            }
          },
          error => console.error(error))
      });
    });
  }

  attend() {
    if (this.isAuthenticated) {
      this.eventService.attend(this.teamEvent, this.userName).subscribe(
        () => {
          if (this.teamEvent.attendees) {
            this.attendees = JSON.parse(this.teamEvent.attendees);
          }
        },
        error => console.error(error)
      )
    }
  }

  discard() {
    if (this.isAuthenticated) {
      this.eventService.discard(this.teamEvent, this.userName).subscribe(
        () => {
          if (this.teamEvent.attendees) {
            this.attendees = JSON.parse(this.teamEvent.attendees);
          }
        },
        error => console.error(error)
      )
    }
  }

  onSubmitComment(eventData) {
    if (this.isAuthenticated) {
      this.connection.send("newComment", this.id, this.userName, eventData.text);
      this.commentForm.reset();
    }
  }
}

interface Comment {
  text: string
}
