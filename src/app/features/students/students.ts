import { Component } from '@angular/core';
import {Button} from "primeng/button";
import { StudentList } from './components/student-list/student-list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-students',
  imports: [Button, StudentList, RouterLink],
  templateUrl: './students.html',
  styleUrl: './students.scss',
})
export class Students {}
