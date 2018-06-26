import {
  Component,
  Input,
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  selector: 'search-component',
  styleUrls: [ './search.component.scss' ],
  templateUrl: './search.component.html'
})

export class SearchComponent {

  @Input() public searchValue: string = '';
  @Output() public searchAction = new EventEmitter<any>();

  /**
   * Emit searchAction with event searchValue
   */
  public search(value: string) {
    this.searchAction.emit(value);
  }
}
