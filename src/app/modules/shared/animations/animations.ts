import {
  animate,
  keyframes,
  query,
  sequence, stagger, state,
  style,
  transition,
  trigger
} from '@angular/animations';

const $timing = '400ms cubic-bezier(0.5,0.5,0.5,1.0)';

const shakeAnimation = [
  style({ transform: 'rotate(0)' }),
  animate('0.1s', style({ transform: 'rotate(2deg)' })),
  animate('0.1s', style({ transform: 'rotate(-2deg)' })),
  animate('0.1s', style({ transform: 'rotate(2deg)' })),
  animate('0.1s', style({ transform: 'rotate(0)' })),
];

export const $animations = [
  trigger('bounce', [
    transition('* => bouncing', [
      animate('300ms ease-in', keyframes([
        style({transform: 'translate3d(0,0,0)', offset: 0}),
        style({transform: 'translate3d(0,-10px,0)', offset: 0.5}),
        style({transform: 'translate3d(0,0,0)', offset: 1})
      ]))
    ])
  ]),

  trigger('inflate', [
    transition(':enter', [
      style({
        opacity: '0',
        height: '0',
        transform: 'rotateX(90deg)'
      }),
      animate($timing, style('*'))
    ]),
    transition(':leave', [
      animate($timing, style({
        opacity: '0',
        height: '0',
        transform: 'rotateX(90deg)'
      }))
    ])
  ]),

  trigger('fadeSlideInOut', [
    transition(':enter', [
      style({opacity: 0, transform: 'translateY(10px)'}),
      animate('500ms', style({opacity: 1, transform: 'translateY(0)'})),
    ]),
    transition(':leave', [
      animate('500ms', style({opacity: 0, transform: 'translateY(10px)'})),
    ]),
  ]),

  trigger('fadeInGrow', [
    transition(':enter', [
      query(':enter', [
        style({opacity: 0, transform: 'scale(0.8)'}),
        sequence([
          animate('500ms', style({opacity: 1})),
          animate('200ms ease-in', style({transform: 'scale(1)'}))
        ]),
      ])
    ])
  ]),

  trigger('fadeInGrowStagger', [
    transition(':enter', [
      query(':enter', [
        style({opacity: 0}),
        stagger('50ms', [
          animate('500ms', style({opacity: 1}))
        ])
      ])
    ])
  ]),

  trigger('openClose', [
    transition(':enter', [
      style({height: 0, opacity: 0, overflow: 'hidden'}),
      animate('.3s ease-in-out', style({height: '*', opacity: 1}))
    ]),
    transition(':leave', [
      style({height: '*', opacity: 1, overflow: 'hidden'}),
      animate('.3s ease-in-out', style({height: 0, opacity: 0}))
    ]),
  ]),

  trigger('queryShake', [
    state('shakeIn',   style({ transform: 'rotate(0)' })),
    state('shakeOut', style({ transform: 'rotate(0)' })),
    transition('shakeIn => shakeOut', [
      animate('0.1s', style({ transform: 'rotate(6deg)', filter: 'drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.6))' })),
      animate('0.1s', style({ transform: 'rotate(-6deg)' })),
      animate('0.1s', style({ transform: 'rotate(6deg)' })),
      animate('0.1s', style({ transform: 'rotate(0)', filter: 'none' }))
    ]),
    transition('shakeOut => shakeIn', [
      animate('0.1s', style({ transform: 'rotate(6deg)', filter: 'drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.6))' })),
      animate('0.1s', style({ transform: 'rotate(-6deg)' })),
      animate('0.1s', style({ transform: 'rotate(6deg)' })),
      animate('0.1s', style({ transform: 'rotate(0)', filter: 'none' }))
    ]),
  ]),
];
