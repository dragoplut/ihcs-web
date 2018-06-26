import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'modules',
  styleUrls: [ './modules.component.scss' ],
  templateUrl: './modules.component.html'
})
export class ModulesComponent implements OnInit {

  // constructor() {}

  public ngOnInit() {
    console.log('ModulesComponent inited.');
  }
}
