import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { VARIABLES_MOCK } from '../../shared/constants';
import { JsonServicesPayload } from '../../shared/patterns';
import { JsonService } from '../../services/';
import { AppState } from '../../app.service';
import { GoogleChartComponent } from 'ng2-google-charts';

import * as moment from 'moment';
// noinspection TypeScriptCheckImport
import * as _ from 'lodash';

@Component({
  selector: 'variables-logs',
  styleUrls: [ './variables-logs.component.scss' ],
  templateUrl: './variables-logs.component.html'
})
export class VariablesLogsComponent implements OnInit, OnDestroy {

  @ViewChild('cchart') public cchart: GoogleChartComponent;

  /**
   * Set our default values
   */
  public loading: boolean = false;
  public activeVariable: any = {
    name: '',
    multipleNames: [],
    offset: moment().utcOffset(),
    startTime: '00:00',
    startTimeFormatted: '00:00',
    startDate: moment()
      .utcOffset(0)
      .subtract(1, 'hours')
      .startOf('day')
      .toISOString(),
    startDateFormatted: moment()
      .utcOffset(0)
      .subtract(1, 'hours')
      .startOf('day')
      .format('YYYY-MM-DD')
  };
  public variables: any = new MatTableDataSource<Element>([]);
  public block: any = {
    chart: true
  };

  public variablesLogsItems: any[] = [];

  public dataTableInitial: any[] = [
    ['Time']
  ];

  public scatterChartData: any = {
    chartType: 'LineChart',
    dataTable: [],
    options: {
      chartArea: { height: '60%', width: '85%', bottom: '35%', left: '10%', top: '10%' },
      title: '',
      hAxis: {
        title: 'Time',
        format: 'YYYY-MM-DD HH:mm',
        textStyle: {
          fontSize : 11
        },
        gridlines: {
          count: 6
        }
      },
      vAxis: {
        title: 'Value',
        minValue: 10,
        maxValue: 20,
        gridlines: {
          count: 8
        }
      },
      // curveType: 'function',
      height: 350,
      minorTicks: 10,
      min: 0, max: 30,
      // majorTicks: ['0', '1', '2', '3', '4', '5'],
      legend: 'bottom',
      // pointsVisible: 'true',
      // pointSize: 9,
      // lineWidth: 4,
      // colors: [ '#2cc0e9' ],
      // type: 'line'
    }
  };

  public showOptionsList: string[] = [ 'ALL DATA', 'DAY', 'WEEK', 'MONTH', 'YEAR' ];
  public groupOptionsList: string[] = [ 'PER LINE' ];

  public showOptions: any = new FormControl();
  public groupOptions: any = new FormControl();

  public varsLoggingOff: any = '';
  public varsLoggedArr: string[] = [];
  public chartVariablesData: any[] = [];
  public chartDate: any = '';
  private subscriber: any;

  /**
   * TypeScript public modifiers
   */
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public state: AppState,
    public json: JsonService
  ) {}

  public ngOnInit() {
    this.subscriber = this.route.params.subscribe((params: any) => {
      this.activeVariable.name = params['varname'];
      this.activeVariable.multipleNames = params['varname'].split('::');
    });

    // this.populateVariables();
    // this.getAppList();
    this.requestLogs();
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  public populateChart(response: any) {
    if (response && response.length) {
      const varsLogged: any[] = this.state.get('requestVarsLogged');
      this.varsLoggedArr = varsLogged.map((v: any) => v.name);
      // const styleParam: any = {'type': 'string', 'role': 'style'};
      // const styling: string = `point { stroke-width: 1px; ` +
      //   `stroke-color: #969696; fill-color: #ffffff; }`;
      // const styleIdx: number = this.activeVariable.multipleNames.length + 1;
      const tableData: any = _.clone(this.dataTableInitial);
      const loggingOffArr: string[] = [];
      this.activeVariable.multipleNames.forEach((vn: string, idx: number) => {
        tableData[0][idx + 1] = vn;
        if (!_.includes(this.varsLoggedArr, vn)) {
          loggingOffArr.push(vn);
        }
      });
      // tableData[0][styleIdx] = styleParam;
      response.forEach((item: any, index: number) => {
        item.datetime = moment(item.datetime).format('YYYY-MM-DD HH:mm');
        const varForChart: any = _.find(
          varsLogged,
          {name: item.name}
        );
        const gain: number = varForChart && varForChart.gain ? varForChart.gain : 1;
        // const logDate: any = new Date(item.datetime).getDate();
        const dateExist: boolean = tableData[tableData.length - 1] &&
          tableData[tableData.length - 1][0] === item.datetime;
        const row: any[] = dateExist ? tableData[tableData.length - 1] : [];
        const valueIdx: number = this.activeVariable.multipleNames.indexOf(item.name) + 1;
        row[0] = item.datetime;
        row[valueIdx] = typeof item[item.name] === 'string' ?
          parseInt(item.value, 10) * gain : item[item.name] * gain;
        // row[styleIdx] = styling;

        this.activeVariable.multipleNames.forEach((varName: string) => {
          const nameIdx: number = this.activeVariable.multipleNames.indexOf(varName) + 1;
          const prevIdx: any = tableData.length - 1;
          if (!row[nameIdx]) {
            const prevVal: any = tableData[prevIdx][nameIdx];
            row[nameIdx] = prevVal && prevIdx ? prevVal : 0;
          }
        });

        if (dateExist) {
          tableData[tableData.length - 1] = row;
        } else if (!_.includes(tableData, row)) {
          tableData.push(row);
        }
      });
      this.scatterChartData.dataTable = [];
      this.chartVariablesData = _.uniq(tableData);
    } else {
      this.scatterChartData.dataTable = [];
      // this.scatterChartData.dataTable = [
      //   ['Date', this.activeVariable.multipleNames[0], {'type': 'string', 'role': 'style'}],
      //   [ 1, 13, 'point { stroke-width: 1px; stroke-color: #969696; fill-color: #ffffff; }'],
      //   [ 2, 12, 'point { stroke-width: 1px; stroke-color: #969696; fill-color: #ffffff; }'],
      //   [ 4, 5.5, 'point { stroke-width: 1px; stroke-color: #969696; fill-color: #ffffff; }'],
      //   [ 7, 14, 'point { stroke-width: 1px; stroke-color: #969696; fill-color: #ffffff; }']
      // ];
    }
    this.scatterChartData.options.title = '';
  }

  public populateVariables(searchValue?: string, resp?: any) {
    const unfilteredItems: any[] = [];
    const variablesResponse: any = resp ? resp : VARIABLES_MOCK;
    variablesResponse.result.var.forEach((item: any, idx: number) => {
      const position: number = idx + 1;
      item.checked = false;
      item.groupName = 'Group_' + position;
      if (item && item.value) {
        item.value = item.value.uValue || item.value.sValue || item.value.bValue;
      }
      unfilteredItems.push(item);
    });
    this.variables.data = this.searchByString(unfilteredItems, searchValue || '');
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

  public getVariableLogs(time?: any, varNameToRequest?: string, callback?: any, reject?: any) {
    const varName: string = varNameToRequest || this.activeVariable.multipleNames[0];
    if (time) {
      this.activeVariable.startDate = moment(time.value).toISOString();
    }
    this.loading = true;
    // const varsLogged: any[] = this.state.get('requestVarsLogged');
    // const varForChart: any = _.find(
    //   varsLogged,
    //   {name: varName}
    // );
    const payload: JsonServicesPayload = new JsonServicesPayload();
    payload.method = 'logging.getVariableLog';
    payload.params[0] = {
      interval: 0,
      name: varName,
      period: 0,
      start_date: { str: time && time.value ?
          moment(time.value).utcOffset(0).toISOString() :
          moment(this.activeVariable.startDate).utcOffset(0).toISOString()
      }
    };
    this.json.requestByPayload(payload).subscribe(
      (resp: any) => {
        let existingLogs: any[] = this.state.get('requestVarLog');
        if (resp.result.log && resp.result.log.length) {
          resp.result.log.forEach((item: any) => {
            if (item && typeof item.value === 'object') {
              item[resp.result.name] = item.value.uValue || item.value.sValue || item.value.bValue;
            } else {
              item[resp.result.name] = item.value;
            }
            item.name = resp.result.name;
            if (item && item.datetime && typeof item.datetime === 'object' && item.datetime.str) {
              item.datetime = item.datetime.str;
            }
            const existingDateIdx: number = existingLogs.indexOf(
              _.find(existingLogs, { datetime: item.datetime})
            );
            if (existingDateIdx === -1) {
              existingLogs.push(item);
            } else {
              for (const prop in item) {
                if (prop) {
                  existingLogs[existingDateIdx][prop] = item[prop];
                }
              }
            }
          });
          existingLogs = _.orderBy(existingLogs, ['datetime', 'desc']);
          this.state.set('requestVarLog', existingLogs);
          this.populateChart(existingLogs);
        } else {
          this.varsLoggingOff = this.varsLoggingOff.length ?
            this.varsLoggingOff + ', ' + varName : varName;
        }
        this.loading = false;
        if (callback) { callback(resp); }
      },
      (err: any) => {
        this.loading = false;
        if (reject) { reject(err); }
      }
    );
  }

  public requestLogs(time?: any) {
    this.varsLoggingOff = '';
    this.chartVariablesData = [];
    this.state.set('requestVarLog', []);
    this.activeVariable.startDateFormatted = moment(
      time ? time.value : this.activeVariable.startDate)
      .format('YYYY-MM-DD');
    this.activeVariable.startTimeFormatted = moment(
      time ? time.value : this.activeVariable.startDate)
      .format("HH:mm");
    const names: string[] = JSON.parse(JSON.stringify(this.activeVariable.multipleNames));

    this.varsRequestLoop(names, time);

    // this.activeVariable.multipleNames.forEach((varName: string) => {
    //   setTimeout(() => {
    //     const defaultTime: any = { value: this.activeVariable.startDate };
    //     this.getVariableLogs(
    //       time || defaultTime,
    //       varName,
    //       (done: any) => {},
    //       (err: any) => {}
    //       );
    //   }, 600);
    // });
  }

  public varsRequestLoop(varNames: string[], time?: any, callback?: any, reject?: any) {
    if (varNames && varNames.length && varNames[0]) {
      const defaultTime: any = { value: this.activeVariable.startDate };
      this.getVariableLogs(
        time || defaultTime,
        varNames[0],
        (done: any) => { this.varsRequestLoop(varNames.slice(1), time); },
        (err: any) => { console.log('getVariableLogs err: ', err); }
      );
    } else {
      const ticks: string[] = [];
      const ticksLimit: number = 10;
      if (this.chartVariablesData && this.chartVariablesData.length > ticksLimit) {
        const tickGap: number = Math.floor(this.chartVariablesData.length / ticksLimit);
        for (let i = 1; i < this.chartVariablesData.length; i += tickGap) {
          ticks.push(moment(this.chartVariablesData[i][0]).format('YYYY-MM-DD HH:mm'));
        }
        this.scatterChartData.options.hAxis.ticks = ticks;
        this.scatterChartData.options.hAxis.majorTicks = ticks;
        this.scatterChartData.options.ticks = ticks;
      }
      this.scatterChartData.dataTable = _.uniq(_.clone(this.chartVariablesData));
      // force a redraw
      if (this.cchart && this.cchart.wrapper) {
        const dataTable: any = this.cchart.wrapper.getDataTable();
        if (dataTable && dataTable.og) {
          dataTable.removeRows(1, dataTable.og.length);
        }
        this.scatterChartData = Object.create(this.scatterChartData);
        if (this.cchart.redraw) {
          this.cchart.redraw();
          this.cchart.wrapper.draw();
        }
      }
    }
  }

  public export() {
    console.log('Do export.');
  }

  public setTimeAndGetVars(time: any, source?: string) {
    const timeArr: string[] = time.split(':');
    const hh: string = timeArr[0];
    const mm: string = timeArr[1].slice(0, 2);
    if (hh && mm) {
      const originalDate: any = moment(this.activeVariable.startDate);
      originalDate.hour(hh);
      originalDate.minute(mm);
      this.activeVariable.startDate = moment(originalDate)
        .add(moment()
        .utcOffset(), 'minutes')
        .toISOString();
      this.activeVariable.startDateFormatted = moment(originalDate).format('YYYY-MM-DD');
      this.activeVariable.startTimeFormatted = moment(originalDate).format("HH:mm");
      const startDateTime: any = { value: this.activeVariable.startDate };
      this.requestLogs(startDateTime);
    }
  }

  /**
   * Search function
   * @param {any[]} items
   * @param {string} searchVal
   * @returns {any[]}
   */
  private searchByString(items: any[], searchVal: string) {
    if (searchVal && searchVal.length) {
      /**
       * Transform search string toLowerCase for next searc
       * @type {string}
       */
      searchVal = searchVal.toLowerCase();
      /**
       * Found users will be stored here
       * @type {any[]}
       */
      const filtered: any[] = [];
      /**
       * Define prop names to search in
       * @type {string[]}
       */
      const propsToSearch = [
        'groupName',
        'value',
        'name'
      ];
      /**
       * Loop our items
       */
      items.forEach(function(item) {
        /**
         * Loop in allowed props to search
         */
        for (const propName of propsToSearch) {
          /**
           * Check if value exist and if it includes searchVal
           */
          if (item[propName] && item[propName].toLowerCase().indexOf(searchVal) !== -1) {
            /**
             * Found match push to filtered array and exit from current loop
             */
            filtered.push(item);
            break;
          }
        }
      });
      /**
       * Return filtered items
       */
      return filtered;
    } else {
      /**
       * Return empty result if searchVal is empty or not a string
       */
      return items;
    }
  }

}
