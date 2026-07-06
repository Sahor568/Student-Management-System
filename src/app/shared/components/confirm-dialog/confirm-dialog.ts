import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmDialog as PrimeConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [PrimeConfirmDialog],
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  private confirmationService = inject(ConfirmationService);

  @Input() message = 'Are you sure?';
  @Input() header = 'Confirmation';
  @Input() acceptLabel = 'Yes';
  @Input() rejectLabel = 'No';
  @Input() acceptSeverity:
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | 'primary' = 'primary';
  @Input() icon = 'pi pi-exclamation-triangle';

  @Output() accept = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  confirm(event?: Event) {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: this.message,
      header: this.header,
      icon: this.icon,
      closable: true,
      closeOnEscape: true,
      acceptButtonProps: {
        label: this.acceptLabel,
        severity: this.acceptSeverity,
      },
      rejectButtonProps: {
        label: this.rejectLabel,
        severity: 'secondary',
        outlined: true,
      },
      accept: () => this.accept.emit(),
      reject: () => this.reject.emit(),
    });
  }
}
