import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// noinspection TypeScriptCheckImport
// import * as _ from 'lodash';

@Component({
  selector: 'dialog-log',
  styleUrls: [ './dialog-log.component.scss' ],
  templateUrl: './dialog-log.component.html'
})

export class DialogLogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
