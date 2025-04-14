import * as React from 'react';
import { IInputs } from './generated/ManifestTypes';
import {
  Input,
  FluentProvider,
  webLightTheme,
} from "@fluentui/react-components";
import * as Models from './Models';
import { HelperXrm } from './Utils';
import './style.css';


//Interface Props
export interface IMainProps {

  ValueField?: number;
  inputChange?: (value: number | undefined) => void;
  context?: ComponentFramework.Context<IInputs>;
}
//State Interface
export interface IMainState {
  
  ValueField?: number;
  MomentColorField?: string;
  LightSettings?: Models.ILightSettings;
  ColoredIconWebResourceBase64?: string;

}

//Implementation of Main Component
export function Main(props: IMainProps) {
  const [state, setState] = React.useState<IMainState>({ MomentColorField: undefined, ValueField: props.ValueField, LightSettings: undefined });
  const helper = new HelperXrm(props.context);
  React.useEffect(() => {
    const onLoad = async () => {
      const _lightSettings = await getSettings();
      const _momentColor = await getColorForValue(props.ValueField, _lightSettings);
      let _coloredIconWebResourceBase64 = undefined;

      if(_lightSettings && _lightSettings?.IconContentBase64) {
        let newIcon = helper.changeIconColor(_lightSettings.IconContentBase64, _momentColor);
        newIcon = helper.resizeIcon(newIcon,_lightSettings.IconSize);
        if(newIcon && newIcon !== "" && helper.isValidBase64Icon(newIcon)) {
          _coloredIconWebResourceBase64 = newIcon;
        }
      }
      setState({
        ...state,
        LightSettings: _lightSettings,
        MomentColorField: _momentColor,
        ValueField: props.ValueField,
        ColoredIconWebResourceBase64: _coloredIconWebResourceBase64

      });
    };
    onLoad();
  }, []);

  const getColorForValue = async (value: number | undefined, lightSettings: Models.ILightSettings | undefined) : Promise<string> => {

    let color = "black";
    
    if (lightSettings && value !== undefined) {
      if (lightSettings.LevelValue1 !== undefined && value >= lightSettings.LevelValue1) {
        color = lightSettings.ColorLevel1;
      } else if (lightSettings.LevelValue2 !== undefined && lightSettings.LevelValue1 !== undefined && value < lightSettings.LevelValue1 && value >= lightSettings.LevelValue2) {
        color = lightSettings.ColorLevel2;
      } else if (lightSettings.LevelValue3 !== undefined && lightSettings.LevelValue2 !== undefined && value < lightSettings.LevelValue2 && value >= lightSettings.LevelValue3) {
        color = lightSettings.ColorLevel3;
      }
    }

    return color;
  };

  const getSettings = async () => {
    const _lightSettings = await helper.getLightSettings();
    return _lightSettings;
  };

  const onChange = async (ev: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
    
    let newValue: number | undefined = undefined;
    if (data.value)
      newValue = Number(data.value);
    if (props.inputChange) {
      props.inputChange(newValue);
      const _lightSettings = await getSettings();
      const _momentColor = await getColorForValue(newValue, _lightSettings);
      let _coloredIconWebResourceBase64 = undefined;

      if(_lightSettings && _lightSettings?.IconContentBase64) {
        let newIcon = helper.changeIconColor(_lightSettings.IconContentBase64, _momentColor);
        newIcon = helper.resizeIcon(newIcon,_lightSettings.IconSize);
        if(newIcon && newIcon !== "" && helper.isValidBase64Icon(newIcon)) {
          _coloredIconWebResourceBase64 = newIcon;
        }
      }
      setState({
        ...state,
        LightSettings: _lightSettings,
        MomentColorField: _momentColor,
        ValueField: newValue,
        ColoredIconWebResourceBase64: _coloredIconWebResourceBase64
      });
    }
  };

  return (
      <FluentProvider theme={webLightTheme} className='status-light-container-main'> 
        {state.LightSettings && !state.ColoredIconWebResourceBase64 && state.LightSettings.DefautIcon ? (
          <>
            <Input
              {...((state.LightSettings?.IconPosition ?? 0) === 0
                ? { contentBefore: React.createElement(state.LightSettings.DefautIcon, { style: { color: state.MomentColorField } }) }
                : { contentAfter: React.createElement(state.LightSettings.DefautIcon, { style: { color: state.MomentColorField } }) })
              } onChange={onChange} value={state.ValueField ? state.ValueField.toString() : ""} appearance="underline"
              style={{ backgroundColor: state.LightSettings.BackgoundColor, borderColor: state.LightSettings.BorderColor , borderRadius: '4px'}}
            />
          </>
        ) : state.LightSettings && state.ColoredIconWebResourceBase64 ? (
          <>
            <Input
                {...((state.LightSettings?.IconPosition ?? 0) === 0
                ? { contentBefore: <span style={{ display: 'inline-block', transform: 'translate(1px, 3px)' }}><img src={`data:image/svg+xml;base64,${state.ColoredIconWebResourceBase64}`} /></span> }
                : { contentAfter: <span style={{ display: 'inline-block', transform: 'translate(8px, 3px)' }}><img src={`data:image/svg+xml;base64,${state.ColoredIconWebResourceBase64}`} /></span> })}
              onChange={onChange} value={state.ValueField ? state.ValueField.toString() : ""}
              style={{ backgroundColor: state.LightSettings.BackgoundColor, borderColor: state.LightSettings.BorderColor , borderRadius: '4px'}}
            />
          </>
        ) : <Input onChange={onChange} value={state.ValueField ? state.ValueField.toString() : ""} style={{ backgroundColor: '#f5f5f5', borderColor: '#f5f5f5', borderRadius: '4px' }} />}
      </FluentProvider>
  );
}