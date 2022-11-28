import {Component} from '@angular/core';

@Component({
  template: '',
})
export abstract class MovingDialogComponent {
  public top: number;
  public left: number;
  private layerX: number;
  private layerY: number;
  private modalElement: HTMLElement;
  private mouseBtnIsDown = false;

  public get moveStyle(): string {
    return `top: ${this.top || 200}px; left: ${this.left || '70'}${this.left ? 'px' : '%'}`;
  }

  public mouseMove(event: any): void {
    if (this.mouseBtnIsDown) {
      this.top = event.pageY - this.layerY;
      this.left = event.pageX - this.layerX;
      this.modalElement.style.left = `${this.left}px`;
      this.modalElement.style.top = `${this.top}px`;
    }
  }

  public mouseDown(event: any): void {
    if (event.target.tagName === 'DIV' && String(event.target.className).includes('p-dialog p-dynamic-dialog')){
      this.mouseBtnIsDown = true;
      this.layerX = event.layerX;
      this.layerY = event.layerY;
    }
  }

  public mouseUp(event: any): void {
    this.mouseBtnIsDown = false;
  }

  public addMovingForDialog(): void {
    this.modalElement = (document.getElementsByClassName('p-dialog p-dynamic-dialog') as HTMLCollectionOf<HTMLElement>)[0];
    this.modalElement.classList.add('unselectable');
    this.modalElement.style.position = `absolute`;
    this.modalElement.addEventListener('mousedown', (e) => this.mouseDown(e));
    this.modalElement.addEventListener('mouseup', (e) => this.mouseUp(e));
    this.modalElement.addEventListener('mousemove', (e) => this.mouseMove(e));
    this.modalElement.addEventListener('mouseover', (e) => {
      this.modalElement.classList.add('hover-moved-zone');
    });
    this.modalElement.addEventListener('mouseout', (e) => {
      this.modalElement.classList.remove('hover-moved-zone');
    });
  }
}
