import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../app.service';
import { JsonService } from '../../services/';

@Component({
  selector: 'device',
  styleUrls: [ './device.component.scss' ],
  templateUrl: './device.component.html'
})
export class DeviceComponent implements OnInit, OnDestroy {

  public data: any = {
    productName: '',
    mac: '64:5A:04:C6:FD:16',
    ip: '192.168.1.100',
    productCode: '23453',
    productNumber: '8500039'
  };

  private subscriber: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public state: AppState,
    public json: JsonService
  ) {}

  public ngOnInit() {
    this.subscriber = this.route.params.subscribe((params: any) => {
      const routeParamsGroupId = params['id'];
    });
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  public saveDevice(data: any) {
    console.log('saveDevice data: ', data);
  }

  public goTo(route: string) {
    const routes: any = this.state.get('routes');
    this.state.set('activeRoute', routes[route]);
    this.router.navigate(routes[route].path);
  }
}
