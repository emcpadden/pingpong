import { TestBed } from '@angular/core/testing';

import { PingPongMessagingService } from './ping-pong-messaging.service';

describe('PingPongMessagingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PingPongMessagingService = TestBed.get(PingPongMessagingService);
    expect(service).toBeTruthy();
  });
});
