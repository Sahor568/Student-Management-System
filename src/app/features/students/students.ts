import { Component, inject, signal } from '@angular/core';
import {Button} from "primeng/button";
import { StudentList } from './components/student-list/student-list';
import { DialogService } from 'primeng/dynamicdialog';
import { StudentForm } from './components/student-form/student-form';

@Component({
  selector: 'app-students',
  imports: [Button, StudentList],
  templateUrl: './students.html',
  styleUrl: './students.scss',
})
export class Students {
  private dialogService = inject(DialogService);

  protected addStudent() {
    this.dialogService.open(StudentForm, {
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
    });
  }
}
