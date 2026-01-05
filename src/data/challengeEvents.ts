/**
 * Event list for short-format challenge nights.
 * This file exports a typed array so editors and the compiler can validate shapes.
 */

import type { Event } from '../types/models';

export const challengeEvents: Event[] = [
  {
    id: '2025-12-28',
    name: 'The Challenge — 12/28',
    startDateTime: new Date('2025-12-28T19:00:00'),
    location: 'Paddle Up Pickleball Club',
    status: 'open',
    link: 'https://mobileapp.courtreserve.com/Online/Events/Details/10117?resId=45176797',
    standings: [
      'cFbaelu4ZQhUiUovuSDq',
      'TMUWdVphOwXWWpBD0tg4',
      'bmIXpKlFhwhNuex6mG3a',
      'sBaVpfAOMRsqcUiaVdXN',
      'ov1yJixQu0Y7GgSVGOS3',
      'v8BhDF0WAc6VgcOwc87B',
      'lR41KMImIthFWUlTfvcq',
      'W3tjD6JMTZvL7h9DBekb',
      'GqsPoUKXTw3kJMSJqwU0',
      'sewQTUTqabMCEYb80N8L',
      'T28AtFw8KdQU23bXrGKh',
      '55YtackrvsPralsAJY2V',
    ],
    rounds: [
      {
        courts: [
          {
            playerNames: ['Tobi Ola', 'Garrett H.', 'Ravi C.', 'Karan C.'],
            matches: [
              { scoreA: 11, scoreB: 7 },
              { scoreA: 11, scoreB: 9 },
              { scoreA: 11, scoreB: 8 },
            ],
          },
          {
            playerNames: ['Bekah Ola', 'Rebecca H.', 'Anna H.', 'Jay H.'],
            matches: [
              { scoreA: 11, scoreB: 7 },
              { scoreA: 11, scoreB: 9 },
              { scoreA: 11, scoreB: 8 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2026-01-04',
    name: 'The Challenge — 1/4',
    startDateTime: new Date('2026-01-04T19:00:00'),
    location: 'Paddle Up Pickleball Club',
    status: 'open',
    link: 'https://mobileapp.courtreserve.com/Online/Events/Details/10117/KIP6A7Q10117168?resId=45176798',
  },
  {
    id: '2026-01-11',
    name: 'The Challenge — 1/11',
    startDateTime: new Date('2026-01-11T19:00:00'),
    location: 'Paddle Up Pickleball Club',
    status: 'open',
    link: 'https://mobileapp.courtreserve.com/Online/Events/Details/10117/SQNPCTF10117214?resId=45176799',
  },
  {
    id: '2026-01-18',
    name: 'The Challenge — 1/18',
    startDateTime: new Date('2026-01-18T19:00:00'),
    location: 'Paddle Up Pickleball Club',
    status: 'open',
    link: 'https://mobileapp.courtreserve.com/Online/Events/Details/10117/6N5ZAKX10117261?resId=45176801',
  },
  {
    id: '2026-01-25',
    name: 'The Challenge — 1/25',
    startDateTime: new Date('2026-01-25T19:00:00'),
    location: 'Paddle Up Pickleball Club',
    status: 'open',
    link: 'https://mobileapp.courtreserve.com/Online/Events/Details/10117/LTANVTQ10117308?resId=45176802',
  },
  {
    id: '2026-02-01',
    name: 'The Challenge — 2/1',
    startDateTime: new Date('2026-02-01T19:00:00'),
    location: 'Paddle Up Pickleball Club',
    status: 'open',
    link: 'https://mobileapp.courtreserve.com/Online/Events/Details/10117/RNU98TK10117356?resId=45176803',
  },
];

export default challengeEvents;
