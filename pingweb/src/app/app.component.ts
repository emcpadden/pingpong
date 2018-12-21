import { Component, OnInit, OnDestroy } from '@angular/core';
import { PingPongMessagingService } from './ping-pong-messaging.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  
  title = 'pingweb';
  private connectionSubscription: Subscription = null;
  private commandSubscription: Subscription = null;
  private messageSubscription: Subscription = null;

  constructor(private pingPongMessagingService: PingPongMessagingService) {
  }

  ngOnInit() {
    this.connectionSubscription = this.pingPongMessagingService.getConnection().subscribe(c => {
      let json = JSON.stringify(c);
      console.log(`PINGPONG CONNECTION: ${json}`);
    });

    this.commandSubscription = this.pingPongMessagingService.getCommand().subscribe(c => {
      let json = JSON.stringify(c);
      console.log(`PINGPONG COMMAND: ${json}`);
    });

    this.messageSubscription = this.pingPongMessagingService.getMessage().subscribe(m => {
      let json = JSON.stringify(m);
      console.log(`PINGPONG MESSAGE: ${json}`);
    });

    this.pingPongMessagingService.sendMessage('This is a test from Ping Service');
  }

  ngOnDestroy() {
    if (!!this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
    if (!!this.commandSubscription) {
      this.commandSubscription.unsubscribe();
    }
    if (!!this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

}
