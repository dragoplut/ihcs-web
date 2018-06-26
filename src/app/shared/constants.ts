export const LANG_KEY: string = 'app_lang';

export const TYPE: any = {
  DEVICE: 'device',
  MODULE: 'module',
  MODULES: 'modules',
  NONE: 'none',
  VARIABLES: 'variables'
};

export const MODULES_MOCK: any[] = [
  { name: 'RVM 1', size: '24 KB', loopTime: '0.25 s.', status: 'Running', errors: [ 'alert' ] },
  { name: 'RVM 2', size: '18 KB', loopTime: '0.20 s.', status: 'Stopped', errors: [ 'alert' ] },
  { name: 'RVM 3', size: '22 KB', loopTime: '0.25 s.', status: 'Running', errors: [ 'alert' ] },
  { name: 'RVM 4', size: '21 KB', loopTime: '0.25 s.', status: 'Running', errors: [ 'alert' ] }
];

export const VARIABLES_MOCK: any = {
  id: '0',
  jsonrpc: '2.0',
  result: {
    var: [
      {
        name: 'Lamp5_OnOff',
        type: 1,
        value: {
          bValue: false
        }
      },
      {
        name: 'Lamp4_OnOff',
        type: 1,
        value: {
          bValue: false
        }
      },
      {
        name: 'Lamp3_OnOff',
        type: 1,
        value: {
          bValue: false
        }
      },
      {
        name: 'Lamp2_OnOff',
        type: 1,
        value: {
          bValue: false
        }
      },
      {
        name: 'Lamp1_OnOff',
        type: 1,
        value: {
          bValue: false
        }
      },
      {
        name: 'DATIM_MONTH',
        type: 2,
        value: {
          uValue: 4
        }
      },
      {
        name: 'THR_HolidayMode',
        type: 1,
        value: {
          bValue: false
        }
      },
      {
        name: 'THR_MeasuredTemp',
        type: 6,
        value: {
          sValue: 275
        }
      },
      {
        name: 'THR_Alive',
        type: 1,
        value: {
          bValue: true
        }
      },
      {
        name: 'Lamp3_ColorTemperature',
        type: 4,
        value: {
          uValue: 2700
        }
      },
      {
        name: 'WEA_OutsideTemperature',
        type: 6,
        value: {
          sValue: -20
        }
      },
      {
        name: 'Lamp1_LevelControl_Level',
        type: 2,
        value: {
          uValue: 0
        }
      },
      {
        name: 'Lamp5_LevelControl_Level',
        type: 2,
        value: {
          uValue: 0
        }
      },
      {
        name: 'Lamp3_LevelControl_Level',
        type: 2,
        value: {
          uValue: 0
        }
      },
      {
        name: 'THR_BoilerModulationLevel',
        type: 6,
        value: {
          sValue: 0
        }
      },
      {
        name: 'Lamp6_ColorTemperature',
        type: 4,
        value: {
          uValue: 2700
        }
      },
      {
        name: 'Lamp2_ColorTemperature',
        type: 4,
        value: {
          uValue: 2700
        }
      },
      {
        name: '8500038_LIGHT',
        type: 5,
        value: {
          sValue: 10
        }
      },
      {
        name: 'THR_AdjustedSetpoint',
        type: 6,
        value: {
          sValue: 155
        }
      },
      {
        name: 'THR_CoolingModulationLevel',
        type: 6,
        value: {
          sValue: 100
        }
      },
      {
        name: 'THR_RemoteHeatingTemperature',
        type: 6,
        value: {}
      },
      {
        name: 'TuinDimTijd',
        type: 2,
        value: {
          uValue: 10
        }
      },
      {
        name: 'TuinVerlichting',
        type: 1,
        value: {
          bValue: true
        }
      },
      {
        name: 'DATIM_MPM',
        type: 4,
        value: {
          uValue: 412
        }
      },
      {
        name: 'Lamp5_ColorTemperature',
        type: 4,
        value: {
          uValue: 2700
        }
      },
      {
        name: 'Lamp1_ColorTemperature',
        type: 4,
        value: {
          uValue: 2700
        }
      },
      {
        name: 'Lamp4_LevelControl_Level',
        type: 2,
        value: {
          uValue: 0
        }
      },
      {
        name: 'THR_ProgramSetpoint',
        type: 6,
        value: {
          sValue: 160
        }
      },
      {
        name: '8500038_TEMP_AMBIENT',
        type: 5,
        value: {
          sValue: 275
        }
      },
      {
        name: 'ScenePIR1',
        type: 1,
        value: {}
      },
      {
        name: 'ScenePIR2',
        type: 1,
        value: {}
      },
      {
        name: 'DATIM_YEAR',
        type: 4,
        value: {
          uValue: 2018
        }
      },
      {
        name: 'Lamp2_LevelControl_Level',
        type: 2,
        value: {
          uValue: 0
        }
      },
      {
        name: 'Lamp6_LevelControl_Level',
        type: 2,
        value: {
          uValue: 0
        }
      },
      {
        name: 'DATIM_MINUTE',
        type: 2,
        value: {
          uValue: 52
        }
      },
      {
        name: 'DATIM_WEEKDAY',
        type: 2,
        value: {
          uValue: 4
        }
      },
      {
        name: 'TuinScene',
        type: 1,
        value: {}
      },
      {
        name: 'DATIM_DAY',
        type: 2,
        value: {
          uValue: 11
        }
      },
      {
        name: 'Lamp4_ColorTemperature',
        type: 4,
        value: {
          uValue: 2700
        }
      },
      {
        name: 'TuinDimmer',
        type: 6,
        value: {
          sValue: 0
        }
      },
      {
        name: 'DATIM_HOUR',
        type: 2,
        value: {
          uValue: 6
        }
      },
      {
        name: 'Lamp6_OnOff',
        type: 1,
        value: {
          bValue: false
        }
      }
    ]
  }
};
