import {animate, keyframes, style, transition, trigger} from '@angular/animations';

const $timing = '400ms cubic-bezier(0.5,0.5,0.5,1.0)';

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
];
