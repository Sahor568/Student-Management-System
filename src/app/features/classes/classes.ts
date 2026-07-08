import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { ClassList } from './components/class-list/class-list';
import { DialogService } from 'primeng/dynamicdialog';
import { ClassForm } from './components/class-form/class-form';

@Component({
  selector: 'app-classes',
  imports: [Button, ClassList],
  templateUrl: './classes.html',
  styleUrl: './classes.scss',
})
export class Classes {
  private dialogService = inject(DialogService);

  protected addClass() {
    this.dialogService.open(ClassForm, {
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
    });
  }
}
