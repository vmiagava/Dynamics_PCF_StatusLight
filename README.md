# StatusLight PCF Control

## Description

The **StatusLight** is a custom control built using the **PowerApps Component Framework (PCF)**. It helps users focus on important data by showing visual indicators like icons and colors based on value thresholds. Similar to a traffic light, it uses color-coded signals (e.g., green, yellow, red) to highlight the status or priority of the information. With options to customize colors, icons, and positions, this control can be tailored to match a company’s branding or the context of the data.



## Features

- Dynamic icon display with support for default or custom icons.
- Color adjustments to indicate different value ranges.
- Icon position configuration, before or after the input value.
- Level and range settings for visual indicators (green, yellow, red).
- Customizable background and border colors.
- Support for SVG font in custom icons.

## Properties

### Supported Numerical Fields in Dataverse
The **StatusLight** control works with any numerical fields in the Dataverse, including:
- Whole Numbers (**Whole.None**)
- Currency (**Currency**)
- Floating-Point Numbers (**FP**)
- Decimal Numbers (**Decimal**)

### Input and Configuration
- **StatusLightPCF**: Base value configuration for the control.
- **IconWebResourceName**: Logical web resource name to replace the default icon (SVG format required).
- **IconWebResourceSize**: Available icon sizes for WebResource (16px, 20px, 24px, 28px, 32px).
- **DefautIcon**: Default icon displayed in the control if the custom icon is unavailable.
- **IconPosition**: Icon position within the input field (before or after the input value).

### Levels and Colors
- **LevelValue1, LevelValue2, LevelValue3**: Value definitions for ranges of Levels 1, 2, and 3.
- **ColorLevel1, ColorLevel2, ColorLevel3**: Colors for Levels 1, 2, and 3 (must be hexadecimal or valid color names).

### Others
- **BackgroundColorField**: Custom background color (default is `#f5f5f5` if invalid).
- **BorderColorField**: Custom border color (default is `#f5f5f5` if invalid).

## Resources Used

This control utilizes the following libraries and resources:
- **React** (version 16.14.0)
- **Fluent UI** (version 9.46.2)
- Main code written in TypeScript (`index.ts`).

## Logic Explanation

The control uses the following logic to determine the appropriate color for the status indicator (`color`) based on a given `value` and predefined thresholds for three levels (`LevelValue1`, `LevelValue2`, `LevelValue3`) and their associated colors (`ColorLevel1`, `ColorLevel2`, `ColorLevel3`):

```typescript
if (lightSettings.LevelValue1 !== undefined && value >= lightSettings.LevelValue1) {
  color = lightSettings.ColorLevel1;
} else if (lightSettings.LevelValue2 !== undefined && lightSettings.LevelValue1 !== undefined && value < lightSettings.LevelValue1 && value >= lightSettings.LevelValue2) {
  color = lightSettings.ColorLevel2;
} else if (lightSettings.LevelValue3 !== undefined && lightSettings.LevelValue2 !== undefined && value < lightSettings.LevelValue2 && value >= lightSettings.LevelValue3) {
  color = lightSettings.ColorLevel3;
}
```

### Explanation:
1. **First Condition**:  
   - If `LevelValue1` is defined and the `value` is greater than or equal to `LevelValue1`, the color is set to `ColorLevel1`. This represents the highest priority level (e.g., "safe" status).

2. **Second Condition**:  
   - If the `value` is less than `LevelValue1` but greater than or equal to `LevelValue2` (and both are defined), the color is set to `ColorLevel2`. This represents a mid-priority level (e.g., "warning" status).

3. **Third Condition**:  
   - If the `value` is less than `LevelValue2` but greater than or equal to `LevelValue3` (and both are defined), the color is set to `ColorLevel3`. This represents the lowest priority level (e.g., "critical" status).

If none of these conditions are met, the color remains unset, indicating the `value` does not fall into any predefined range.

## Notes

- The control does not use external services, as indicated by the `<external-service-usage>` attribute.

## Contact

If you need further refinements or have more details to add, let me know! 😊
