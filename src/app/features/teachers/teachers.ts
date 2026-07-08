import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeacherList } from './components/teacher-list/teacher-list';
import { Button } from 'primeng/button';
import { TeacherForm } from './components/teacher-form/teacher-form';
import { DialogService } from 'primeng/dynamicdialog';
import { ITeacher } from '../../shared/types/teacher.interface';

@Component({
  selector: 'app-teachers',
  imports: [TeacherList, Button],
  templateUrl: './teachers.html',
  styleUrl: './teachers.scss',
})
export class Teachers {
  protected teachers = signal<ITeacher[]>([]);
  private dialogService = inject(DialogService);

  protected addTeacher() {
    this.dialogService.open(TeacherForm, {
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
    });
  }
}
