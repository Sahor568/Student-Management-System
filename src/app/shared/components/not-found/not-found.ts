import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import anime from 'animejs';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.scss'],
})
export class NotFound implements AfterViewInit, OnDestroy {
  @ViewChild('bannerRoot', { static: true }) bannerRoot!: ElementRef<HTMLElement>;

  private rowAnimation?: anime.AnimeInstance;
  private zeroAnimation?: anime.AnimeInstance;

  ngAfterViewInit(): void {
    const root = this.bannerRoot.nativeElement;

    // Equivalent of: anime({ targets: '.row svg', ... })
    const svgEl = root.querySelector('.row svg');
    if (svgEl) {
      this.rowAnimation = anime({
        targets: svgEl,
        translateY: 10,
        autoplay: true,
        loop: true,
        easing: 'easeInOutSine',
        direction: 'alternate',
      });
    }

    // Equivalent of: anime({ targets: '#zero', ... })
    const zeroEl = root.querySelector('#zero');
    if (zeroEl) {
      this.zeroAnimation = anime({
        targets: zeroEl,
        translateX: 10,
        autoplay: true,
        loop: true,
        easing: 'easeInOutSine',
        direction: 'alternate',
        scale: [{ value: 1 }, { value: 1.4 }, { value: 1, delay: 250 }],
        rotateY: { value: '+=180', delay: 200 },
      });
    }
  }

  ngOnDestroy(): void {
    this.rowAnimation?.pause();
    this.zeroAnimation?.pause();
  }
}
