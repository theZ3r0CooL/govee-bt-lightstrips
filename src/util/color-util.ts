export type Color = {
  red: number;
  green: number;
  blue: number;
};

export const hexify = (x: number): string => {
  let toReturn = x.toString(16);
  return toReturn.length < 2 ? "0" + toReturn : toReturn;
};

export const xorColor = (c: Color): number => {
  return c.red ^ c.blue ^ c.green;
};

export const colorToHex = (c: Color): string => {
  return hexify(c.red) + hexify(c.green) + hexify(c.blue);
};

export const hexToColor = (s: string): Color => {
  return {
    red: Number("0x" + s.substring(0, 2)),
    green: Number("0x" + s.substring(2, 4)),
    blue: Number("0x" + s.substring(4, 6)),
  };
};
