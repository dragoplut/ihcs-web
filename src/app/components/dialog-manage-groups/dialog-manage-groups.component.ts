import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

@Component({
  selector: 'dialog-manage-groups',
  styleUrls: [ './dialog-manage-groups.component.scss' ],
  templateUrl: './dialog-manage-groups.component.html'
})

export class DialogManageGroupsComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogManageGroupsComponent>,
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
