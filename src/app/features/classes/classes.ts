import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { ClassList } from './components/class-list/class-list';

@Component({
  selector: 'app-classes',
  imports: [ClassList],
  templateUrl: './classes.html',
  styleUrl: './classes.scss',
})
export class Classes {}
