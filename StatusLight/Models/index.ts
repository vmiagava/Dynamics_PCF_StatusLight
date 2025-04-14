import { FluentIcon } from "@fluentui/react-icons";

export interface IEntityDefinitions {
    LogicalName: string;
}
export interface IIconWebResource {
    name: string;
    content: string;
}
export interface ILightSettings {
    DefautIcon: FluentIcon;
    IconWebResourceName?: string;
    IconContentBase64?: string;
    IconPosition: number;
    IconSize: number;
    LevelValue1: number;
    LevelValue2: number;
    LevelValue3: number;
    ColorLevel1: string;
    ColorLevel2: string;
    ColorLevel3: string;
    BackgoundColor: string;
    BorderColor: string;
}

export interface IIconDefautDictionary {
    [iconKey: number]: FluentIcon;
}
