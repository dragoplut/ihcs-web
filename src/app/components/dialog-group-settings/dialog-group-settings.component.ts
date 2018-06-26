import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

@Component({
  selector: 'dialog-group-settings',
  styleUrls: [ './dialog-group-settings.component.scss' ],
  templateUrl: './dialog-group-settings.component.html'
})

export class DialogGroupSettingsComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogGroupSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public addGroup(name: string) {
    if (name) {
      this.data.groupsList.unshift(name);
      this.data.groupName = '';
    }
  }

  public remove(item: any) {
    if (item) {
      this.data.groupsList = _.filter(this.data.groupsList, (group: any) => group !== item);
    }
  }
}
