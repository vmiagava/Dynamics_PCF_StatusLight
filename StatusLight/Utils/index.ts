import { IInputs } from "../generated/ManifestTypes";
import { ILightSettings, IIconWebResource, IIconDefautDictionary } from "../Models";
import { 
    ShieldFilled, 
    AccessibilityFilled, 
    AlignSpaceEvenlyVerticalFilled, 
    AlertOnFilled, 
    BotSparkleFilled, 
    HeartFilled, 
    MailFilled,
    FluentIcon} from '@fluentui/react-icons';

interface IHelperXrm {
    context?: ComponentFramework.Context<IInputs> | undefined;
}

export class HelperXrm implements IHelperXrm {
    context?: ComponentFramework.Context<IInputs> | undefined;

    constructor(context: ComponentFramework.Context<IInputs> | undefined) {
        this.context = context;
    }

    async RetrieveMultipleAsync(entityName: string, optionOdata?: string): Promise<object> {
        return new Promise((resolve, reject) => {
            this.context?.webAPI.retrieveMultipleRecords(entityName, optionOdata).then(
                (result) => { return resolve(result.entities); },
                (e) => { return reject(e); }
            )
        });
    }
    async FetchJS(url: string): Promise<object[]> {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => {
                    if (!response.ok)
                        return reject("erro");
                    return response.json();
                }).then((data) => {
                    return resolve(data.value);
                }).catch((e) => reject(e));
        });
    }
    getIconWebResource = async (iconLogicalName: string): Promise<IIconWebResource[]> => {
        const icon: IIconWebResource[] = [];
        const response = await this.RetrieveMultipleAsync("webresource", `?$select=name,content&$filter=(name eq '${iconLogicalName}' and webresourcetype eq 11)&$top=1`) as IIconWebResource[];
        if (!response || response.length === 0) {
            return icon;
        }
        response.forEach((element: IIconWebResource) => {
            icon.push({
                name: element.name,
                content: element.content
            });
        });
        return icon;
    }
    async getLightSettings () : Promise<ILightSettings | undefined> {
        
        if(this.context){
            const validatedValues: ILightSettings = {
                DefautIcon: this.context.parameters.DefautIcon.raw ? this.getIconDefautDictionary(Number(this.context.parameters.DefautIcon.raw)) : this.getIconDefautDictionary(1),
                IconPosition: this.context.parameters.IconPosition.raw ? Number(this.context.parameters.IconPosition.raw) : 0,
                IconSize: this.context.parameters.IconWebResourceSize.raw ? Number(this.context.parameters.IconWebResourceSize.raw) : 24,
                LevelValue1: this.context.parameters.LevelValue1.raw ? Number(this.context.parameters.LevelValue1.raw) : 0 as number,
                LevelValue2: this.context.parameters.LevelValue2.raw ? Number(this.context.parameters.LevelValue2.raw) : 0 as number,
                LevelValue3: this.context.parameters.LevelValue3.raw ? Number(this.context.parameters.LevelValue3.raw) : 0 as number,
                ColorLevel1: this.context.parameters.ColorLevel1.raw && this.isValidColor(this.context.parameters.ColorLevel1.raw) ? this.context.parameters.ColorLevel1.raw : "green",
                ColorLevel2: this.context.parameters.ColorLevel2.raw && this.isValidColor(this.context.parameters.ColorLevel2.raw) ? this.context.parameters.ColorLevel2.raw : "#f2dc13",
                ColorLevel3: this.context.parameters.ColorLevel3.raw && this.isValidColor(this.context.parameters.ColorLevel3.raw) ? this.context.parameters.ColorLevel3.raw : "#d61a1a",
                BackgoundColor: this.context.parameters.BackgroundColorField.raw && this.isValidColor(this.context.parameters.BackgroundColorField.raw) ? this.context.parameters.BackgroundColorField.raw : "#f5f5f5",
                BorderColor: this.context.parameters.BorderColorField.raw && this.isValidColor(this.context.parameters.BorderColorField.raw) ? this.context.parameters.BorderColorField.raw : "#f5f5f5"
            };

            if (this.context.parameters.IconWebResourceName.raw) {
                const iconDynamics = await this.getIconWebResource(this.context.parameters.IconWebResourceName.raw);
                //const iconDynamics = "PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDJDNy43OTA4NiAyIDYgMy43OTA4NiA2IDZDNiA4LjIwOTE0IDcuNzkwODYgMTAgMTAgMTBDMTIuMjA5MSAxMCAxNCA4LjIwOTE0IDE0IDZDMTQgMy43OTA4NiAxMi4yMDkxIDIgMTAgMlpNMTQuODY1IDE2Ljc5NjZDMTMuNzkzOCAxNy40Nzk2IDEyLjQxMDkgMTcuODYxNCAxMC45MDMxIDE3Ljk2ODVDMTAuODMwMSAxNy43NzU2IDEwLjcxNiAxNy41OTQ3IDEwLjU2MDcgMTcuNDM5M0w4LjU2MTQ0IDE1LjQ0MDFDOC44NDI1NyAxNC44NTI3IDkgMTQuMTk0NyA5IDEzLjVDOSAxMi41NzQ5IDguNzIwODYgMTEuNzE1MSA4LjI0MjIzIDExTDE1IDExQzE2LjEwNDUgMTEgMTcgMTEuODk1NiAxNyAxM0MxNyAxNC42OTEyIDE2LjE2NzIgMTUuOTY2MyAxNC44NjUgMTYuNzk2NlpNNC41IDE3QzUuMjg2MiAxNyA2LjAxMTg1IDE2Ljc0MDggNi41OTYxNSAxNi4zMDMxTDkuMTQ2NDQgMTguODUzNUM5LjM0MTcgMTkuMDQ4OCA5LjY1ODI4IDE5LjA0ODggOS44NTM1NSAxOC44NTM1QzEwLjA0ODggMTguNjU4MyAxMC4wNDg4IDE4LjM0MTcgOS44NTM1NiAxOC4xNDY0TDcuMzAzMjQgMTUuNTk2QzcuNzQwODIgMTUuMDExNyA4IDE0LjI4NjEgOCAxMy41QzggMTEuNTY3IDYuNDMzIDEwIDQuNSAxMEMyLjU2NyAxMCAxIDExLjU2NyAxIDEzLjVDMSAxNS40MzMgMi41NjcgMTcgNC41IDE3Wk00LjUgMTZDMy4xMTkyOSAxNiAyIDE0Ljg4MDcgMiAxMy41QzIgMTIuMTE5MyAzLjExOTI5IDExIDQuNSAxMUM1Ljg4MDcxIDExIDcgMTIuMTE5MyA3IDEzLjVDNyAxNC44ODA3IDUuODgwNzEgMTYgNC41IDE2WiIgZmlsbD0iIzIxMjEyMSIvPgo8L3N2Zz4K";
                if (iconDynamics && iconDynamics.length > 0) {
                    if (this.isValidBase64Icon(iconDynamics[0].content))
                    {
                        validatedValues.IconContentBase64 = iconDynamics[0].content;
                    }
                }
            }
            return validatedValues;
        }
    }
    getIconDefautDictionary(iconValue: number) : FluentIcon {
        const dictionary: IIconDefautDictionary = {
            1 : ShieldFilled,
            2 : AccessibilityFilled,
            3 : AlignSpaceEvenlyVerticalFilled,
            4 : AlertOnFilled,
            5 : BotSparkleFilled,
            6 : HeartFilled,
            7 : MailFilled
        };

        for (const [key, value] of Object.entries(dictionary)) {
            if (Number(key) === iconValue) {
            return value;
            }
        }

        // Return the first key if iconValue is not found
        return Object.values(dictionary)[0];
    }
    isValidColor(color: string): boolean {
        const hexColorRegex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
        const namedColors = ["red", "green", "blue", "yellow", "black", "white", "gray", "grey", "cyan", "magenta", "purple", "orange", "pink", "brown"];
        return hexColorRegex.test(color) || namedColors.includes(color.toLowerCase());
    }
    isValidBase64Icon(content: string): boolean {
        try {
            const decoded = atob(content);
            const svgRegex = /<svg[^>]*>([\s\S]*?)<\/svg>/;
            return svgRegex.test(decoded);
        } catch (e) {
            return false;
        }
    }
    changeIconColor = (iconBase64: string, color: string): string => {
        const svg = atob(iconBase64);
        const coloredSvg = svg.replace(/fill="[^"]*"/g, `fill="${color}"`);
        return btoa(coloredSvg);
      };
    resizeIcon = (iconBase64: string, size: number): string => {
        const svg = atob(iconBase64);
        const resizedSvg = svg.replace(/width="[^"]*"/, `width="${size}px"`).replace(/height="[^"]*"/, `height="${size}px"`);
        return btoa(resizedSvg);
    };
}