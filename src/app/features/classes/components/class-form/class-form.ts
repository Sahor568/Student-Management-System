import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { INameValue } from '../../../../shared/types/name-Value.interface';

@Component({
  selector: 'app-class-form',
  imports: [FormsModule, InputText, ReactiveFormsModule, Button],
  templateUrl: './class-form.html',
  styleUrl: './class-form.scss',
})
export class ClassForm {
  isEditing = false;
  teacher?: INameValue;

  classForm = new FormGroup({
    userId: new FormControl(),
    className: new FormControl('', Validators.required),
    section: new FormControl('', Validators.required),
    teacherId: new FormControl('', Validators.required),
    monthlyTuitionFees: new FormControl('', Validators.required),
    createdAt: new FormControl(),
  });

  protected onSubmit() {}
}
