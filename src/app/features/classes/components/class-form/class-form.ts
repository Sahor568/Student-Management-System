import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IClass } from '../../../../shared/types/class.interface';
import { Select } from 'primeng/select';
import { TeacherService } from '../../../../shared/services/teacher.service';
import { ITeacher } from '../../../../shared/types/teacher.interface';

@Component({
  selector: 'app-class-form',
  imports: [InputText, ReactiveFormsModule, Button, Select],
  templateUrl: './class-form.html',
  styleUrl: './class-form.scss',
})
export class ClassForm implements OnInit {
  protected loading = signal<boolean>(false);
  teachers: ITeacher[] = [];
  isEditing = false;
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private config = inject(DynamicDialogConfig);
  private dialogRef = inject(DynamicDialogRef);
  private teacherService = inject(TeacherService);

  classForm = new FormGroup({
    className: new FormControl('', Validators.required),
    section: new FormControl('', Validators.required),
    teacherId: new FormControl<string | null>(null, Validators.required),
    monthlyTuitionFees: new FormControl<number | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.getAllTeacher();

    const classId = this.config?.data;

    if (classId) {
      this.isEditing = true;
      this.getClassById(classId);
    }
  }

  getClassById(classId: string) {
    this.loading.set(true);
    this.http.get<IClass>('/classes/' + classId).subscribe({
      next: (cls) => {
        this.classForm.patchValue({
          className: cls.className,
          section: cls.section,
          teacherId: cls.teacherId,
          monthlyTuitionFees: cls.monthlyTuitionFees,
        });
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  async getAllTeacher() {
    this.loading.set(true);
    this.teachers = await this.teacherService.fetchAllTeachers();
    this.loading.set(false);
  }

  onSubmit() {
    if (this.isEditing) {
      this.editClass();
    } else {
      this.createClass();
    }
  }

  createClass() {
    this.http.get<IClass[]>('/classes').subscribe((classes) => {
      const nextId =
        classes.length > 0 ? Math.max(...classes.map((t) => Number(t.classId))) + 1 : 1;

      const newClass: IClass = {
        id: 0,
        classId: nextId,
        createdAt: new Date().toISOString().split('T')[0],
        className: this.classForm.value.className!,
        section: this.classForm.value.section!,
        teacherId: this.classForm.value.teacherId!,
        monthlyTuitionFees: this.classForm.value.monthlyTuitionFees!,
      };

      this.http.post<IClass>('/classes', newClass).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Class Status', 'Class created successfully!');
          this.dialogRef.close();
        },
      });
    });
  }
  editClass(): void {
    const classId = this.config?.data;
    this.http.put<IClass>(`/classes/${classId}`, this.classForm.value).subscribe({
      next: () => {
        this.toastService.showToast('success', 'Class Status', 'Class updated successfully!');
        this.dialogRef.close();
      },
    });
  }
}
