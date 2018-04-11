import {
  Component,
  Input,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import { VARIABLES_MOCK } from '../../shared/constants';

@Component({
  selector: 'table-component',
  styleUrls: [ './table.component.scss' ],
  templateUrl: './table.component.html'
})

// export interface Element {
//   name: string;
//   position?: number;
//   value: any;
//   groupName?: string;
// }

export class TableComponent implements OnInit {

  @Input() public items: any = [];
  // options provided with temporary object as example
  @Input() public options: any = {
    actions: [
      { icon: 'plus', title: 'Add', action: 'add' },
    ],
    itemType: 'variables',
    info: 'Variables'
  };

  @Output() public confirmAction = new EventEmitter<any>();
  @Output() public rejectAction = new EventEmitter<any>();

  public displayedColumns: any = ['checked', 'position', 'name', 'value', 'groupName'];

  public ngOnInit() {
    console.log('TableComponent items', this.items);
    VARIABLES_MOCK.result.var.forEach((item: any, idx: number) => {
      item.checked = false;
      item.position = idx + 1;
      item.groupName = 'Groupname_' + item.position;
      if (item && item.value) {
        item.value = item.value.uValue || item.value.sValue || item.value.bValue;
      }
      this.items.push(item);
    });
    console.log('TableComponent items 2 ', this.items);

  }

  /**
   * Emit rejectAction with event details
   */
  public back(): void {
    const event: any = {
      action: 'cancel',
      items: this.items,
      type: this.options.itemType
    };
    this.rejectAction.emit(event);
  }
}
