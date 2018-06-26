import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialAppModule } from './ngmaterial.module';
import { TreeModule } from 'angular-tree-component';
import { FileDropModule } from 'ngx-file-drop';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MomentModule } from 'angular2-moment';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

/*
 * Platform and Environment providers/directives/pipes
 */
import { environment } from 'environments/environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { TranslateService } from '@ngx-translate/core';
import { AppTranslationModule } from './app.translation.module';

import '../styles/styles.scss';
import '../styles/headings.css';
import * as services from './services/';
import * as components from './components/';
import * as pages from './pages/';

const config: SocketIoConfig = { url: 'ws://192.168.157.167/ws/varserver', options: {} };

const mapValuesToArray = (obj: any) => Object.keys(obj).map((key: any) => obj[key]);

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

interface StoreType {
  state: InternalStateType;
  restoreInputValues: () => void;
  disposeOldHosts: () => void;
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    ...mapValuesToArray(components),
    ...mapValuesToArray(pages)
  ],
  /**
   * Import Angular's modules.
   * useHash: Boolean(history.pushState) === false
   */
  imports: [
    RouterModule.forRoot(ROUTES, {
      useHash: true,
      preloadingStrategy: PreloadAllModules
    }),
    BrowserModule,
    BrowserAnimationsModule,
    FileDropModule,
    MaterialAppModule,
    AppTranslationModule,
    TreeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MomentModule,
    Ng2GoogleChartsModule,
    NgxMaterialTimepickerModule.forRoot(),
    SocketIoModule.forRoot(config),

    /**
     * This section will import the `DevModuleModule` only in certain build types.
     * When the module is not imported it will get tree shaked.
     * This is a simple example, a big app should probably implement some logic
     */
    ...environment.showDevModule ? [] : [],
  ],
  entryComponents: [
    components.DialogManageGroupsComponent,
    components.DialogGroupSettingsComponent,
    components.DialogLogComponent
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    environment.ENV_PROVIDERS,
    APP_PROVIDERS,
    ...mapValuesToArray(services)
  ]
})
export class AppModule {}
