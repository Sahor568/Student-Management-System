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
import { ApiConstants } from '../../../../shared/constants/api.constants';

@Component({
  selector: 'app-class-form',
  imports: [InputText, ReactiveFormsModule, Button, Select],
  templateUrl: './class-form.html',
  styleUrl: './class-form.scss',
})
export class ClassForm implements OnInit {
  protected loading = signal<boolean>(false);
  protected loadingTeacher = signal<boolean>(false);
  protected submitLoading = signal<boolean>(false);

  teachers: ITeacher[] = [];
  isEditing = false;
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private config = inject(DynamicDialogConfig);
  private dialogRef = inject(DynamicDialogRef);
  private teacherService = inject(TeacherService);
  classId = this.config?.data;

  classForm = new FormGroup({
    className: new FormControl('', Validators.required),
    teacherId: new FormControl<number | null>(null, Validators.required),
    monthlyTuitionFees: new FormControl<number | null>(null, Validators.required),
    createdAt: new FormControl(),
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
        this.classForm.patchValue(cls);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  async getAllTeacher() {
    this.loadingTeacher.set(true);
    this.teachers = await this.teacherService.fetchAllTeachers();
    this.loadingTeacher.set(false);
  }

  onSubmit() {
    this.submitLoading.set(true);
    let payload = this.classForm.getRawValue() as IClass;
    let api;

    if (this.isEditing) {
      api = this.http.put<IClass>(`${ApiConstants.CLASS}/${this.classId}`, payload);
    } else {
      payload = {
        ...payload,
        createdAt: new Date().toISOString().split('T')[0],
      };
      api = this.http.post<IClass>(`${ApiConstants.CLASS}`, payload);
    }

    api.subscribe({
      next: () => {
        this.toastService.showToast(
          'success',
          'Success',
          `Class ${this.isEditing ? 'Updated' : 'Created'} successfully!`,
        );
        this.submitLoading.set(false);
        this.dialogRef.close();
      },
      error: (err) => {
        this.submitLoading.set(false);
      },
    });
  }
}
