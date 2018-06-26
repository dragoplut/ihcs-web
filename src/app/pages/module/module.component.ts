import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadEvent, UploadFile } from 'ngx-file-drop';
import { AppState } from '../../app.service';
import { JsonService } from '../../services/';

@Component({
  selector: 'module',
  styleUrls: [ './module.component.scss' ],
  templateUrl: './module.component.html'
})
export class ModuleComponent implements OnInit, OnDestroy {

  public data: any = {
    date: '',
    description: '',
    title: '',
    size: '',
    productName: ''
  };

  public files: UploadFile[] = [];

  private subscriber: any;
  private dummyData: any = {
    date: '21/04/18 4:12 PM',
    description: 'Module description here.',
    title: 'RVM 1',
    size: '24 KB',
    productName: '',
    mac: '64:5A:04:C6:FD:16',
    ip: '192.168.1.100',
    productCode: '23453',
    productNumber: '8500039'
  };

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public state: AppState,
    public json: JsonService
  ) {}

  public ngOnInit() {
    this.subscriber = this.route.params.subscribe((params: any) => {
      const routeParamsGroupId = params['id'];
      const routeParamsModuleId = params['moduleId'];
      if (routeParamsModuleId && routeParamsModuleId !== 'new') {
        this.data = this.dummyData;
      }
      this.data.id = routeParamsModuleId;
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

  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry: any = droppedFile.fileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          /**
           // You could upload it like this:
           const formData = new FormData()
           formData.append('logo', file, relativePath)

           // Headers
           const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

           this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
           .subscribe(data => {
            // Sanitized logo returned from backend
          })
           **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry;
      }
    }
  }

  public fileOver(event){
    console.log(event);
  }

  public fileLeave(event){
    console.log(event);
  }
}
