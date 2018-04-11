import {
  Component,
  OnInit
} from '@angular/core';
import { JsonService } from '../../services/';
import { JsonServicesPayload } from '../../shared/patterns/';
import { VARIABLES_MOCK } from '../../shared/constants';

@Component({
  selector: 'variables',  // <settings></settings>
  styleUrls: [ './variables.component.scss' ],
  templateUrl: './variables.component.html'
})
export class VariablesComponent implements OnInit {
  /**
   * Set our default values
   */
  public variables: any = [];
  /**
   * TypeScript public modifiers
   */
  constructor(public json: JsonService) {}

  public ngOnInit() {
    console.log('VariablesComponent inited.');
    VARIABLES_MOCK.result.var.forEach((item: any, idx: number) => {
      item.checked = false;
      item.position = idx + 1;
      item.groupName = 'Groupname_' + item.position;
      if (item && item.value) {
        item.value = item.value.uValue || item.value.sValue || item.value.bValue;
      }
      this.variables.push(item);
    });
    console.log('this.variables: ', this.variables);
    this.getAppList();
  }

  public getAppList() {
    // const payload: JsonServicesPayload = new JsonServicesPayload();
    // payload.method = 'appmanager.appList';
    // this.json.requestByPayload(payload).subscribe(
    //   (resp: any) => {
    //     console.log('requestByPayload resp: ', resp);
    //   },
    //   (err: any) => {
    //     console.log('requestByPayload err: ', err);
    //   }
    // );
  }
}
