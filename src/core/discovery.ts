import noble from "@abandonware/noble";
import { GoveeLightStrip } from "@/govee-light-strip/types";
import * as constants from "@/constants/constants";
import { isValidPeripheral } from "@/util/validation";
import { setInitialState, sendKeepAlive } from "@/govee-light-strip/service";

export let DEBUG = true;
let scanStartCallback: undefined | Function;
let scanStopCallback: undefined | Function;
let discoveryCallback: undefined | ((ledStrip: GoveeLightStrip) => void);

export var ledStrips: { [uuid: string]: GoveeLightStrip } = {};

noble.on("discover", async (peripheral) => {
  const { id, uuid, address, state, rssi, advertisement } = peripheral;

  if (DEBUG) {
    console.log(
      "Discovered",
      id,
      uuid,
      address,
      state,
      rssi,
      advertisement.localName,
    );
  }

  let model = isValidPeripheral(peripheral);
  if (model == "") {
    if (DEBUG) {
      // TODO: Print something
    }
    return;
  }

  if (ledStrips[uuid]) {
    return;
  }

  if (DEBUG) {
    peripheral.on("disconnect", (err) => {
      console.log(advertisement.localName + " disconnected with error: " + err);
    });

    peripheral.on("connect", (err) => {
      console.log(advertisement.localName + " connected with error: " + err);
    });
  }

  await peripheral.connectAsync();
  let stuffFound = await peripheral.discoverSomeServicesAndCharacteristicsAsync(
    [],
    [constants.WRITE_CHAR_UUID],
  );
  if (!stuffFound.characteristics) {
    return;
  }

  let toSave: GoveeLightStrip = {
    uuid,
    name: advertisement.localName,
    model,
    writeCharacteristic: stuffFound.characteristics[0],
    color: constants.INIT_COLOR,
    isWhite: false,
    brightness: constants.INIT_BRIGHTNESS,
    power: constants.INIT_POWER,
  };

  setInitialState(toSave);
  ledStrips[toSave.uuid] = toSave;

  setInterval(() => {
    sendKeepAlive(toSave);
    if (DEBUG) {
      console.log("sending KEEP ALIVE");
    }
  }, constants.KEEP_ALIVE_INTERVAL_MS);

  if (discoveryCallback) {
    discoveryCallback(toSave);
  }
});

noble.on("scanStart", () => {
  if (DEBUG) {
    console.log("Scan Started!");
  }
  if (scanStartCallback) {
    scanStartCallback();
  }
});

noble.on("scanStop", () => {
  if (DEBUG) {
    console.log("Scan Stopped!");
  }
  if (scanStopCallback) {
    scanStopCallback();
  }
});

noble.on("stateChange", (state) => {
  if (DEBUG) {
    console.log("State changed:", state);
  }
});

export const debug = (on: boolean) => {
  DEBUG = on;
};

export const startDiscovery = async () => {
  await noble.startScanningAsync([], false);
};

export const stopDiscovery = async () => {
  await noble.stopScanningAsync();

  scanStartCallback = undefined;
  scanStopCallback = undefined;
};

export const getListOfStrips = () => {
  return ledStrips;
};

export const registerScanStart = (callback: Function) => {
  scanStartCallback = callback;
};
export const registerScanStop = (callback: Function) => {
  scanStopCallback = callback;
};
export const registerDiscoveryCallback = (
  callback: (ledStrip: GoveeLightStrip) => void,
) => {
  discoveryCallback = callback;
};
