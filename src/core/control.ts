import { ledStrips, DEBUG } from "@/core/discovery";
import { GoveeLightStrip } from "@/govee-light-strip/types";
import { Color, colorToHex } from "@/util/color-util";
import { isValidColor, isValidValue } from "@/util/validation";
import { setLightStripColor, setLightStripBrightness, setLightStripPower } from "@/govee-light-strip/service";

export const setColorOfStrip = (
  ledStrip: GoveeLightStrip,
  newColor: Color,
  isWhite: boolean,
): GoveeLightStrip | undefined => {
  if (DEBUG) {
    console.log(
      "Color: #" +
        colorToHex(newColor) +
        ", White: " +
        isWhite +
        ", Strip: " +
        ledStrip.uuid,
    );
  }

  if (!isValidColor(newColor)) {
    if (DEBUG) {
      console.log("ERROR: INVALID COLOR");
    }
    return;
  }

  ledStrips[ledStrip.uuid] = setLightStripColor(ledStrip, newColor, isWhite);
  return ledStrips[ledStrip.uuid];
};

export const setBrightnessOfStrip = (
  ledStrip: GoveeLightStrip,
  newBrightness: number,
): GoveeLightStrip | undefined => {
  if (!isValidValue(newBrightness)) {
    return;
  }

  ledStrips[ledStrip.uuid] = setLightStripBrightness(ledStrip, newBrightness);
  return ledStrips[ledStrip.uuid];
};

export const setPowerOfStrip = (
  ledStrip: GoveeLightStrip,
  power: boolean,
): GoveeLightStrip | undefined => {
  ledStrips[ledStrip.uuid] = setLightStripPower(ledStrip, power);
  return ledStrips[ledStrip.uuid];
};
