import promptSync from "prompt-sync";
import {
  registerDiscoveryCallback,
  setBrightnessOfStrip,
  setColorOfStrip,
  setPowerOfStrip,
  startDiscovery,
} from "@/index";
import { hexToColor } from "@/util/color-util";

const prompt = promptSync();

// debug(true);

startDiscovery();

registerDiscoveryCallback(async (ledStrip) => {
  // while(true)
  // {
  //     const color =  prompt("Enter color: ")

  //     setColorOfStrip(ledStrip, hexToColor(color!))
  // }
  console.log("found: " + ledStrip.name);

  const processCommands = async () => {
    while (true) {
      const input = prompt(
        "Enter command (power on/off, brightness <0-100>, color <hex>): ",
      );
      if (!input) continue;

      const parts = input.toLowerCase().trim().split(" ");

      if (parts[0] === "exit") {
        console.log("Exiting...");
        break;
      } else if (parts[0] === "power" && parts.length === 2) {
        if (parts[1] === "on") {
          setPowerOfStrip(ledStrip, true);
          console.log("Power turned on");
        } else if (parts[1] === "off") {
          setPowerOfStrip(ledStrip, false);
          console.log("Power turned off");
        }
      } else if (parts[0] === "brightness" && parts.length === 2) {
        const brightness = parseInt(parts[1]);
        if (brightness >= 0 && brightness <= 100) {
          setBrightnessOfStrip(ledStrip, brightness);
          console.log(`Brightness set to ${brightness}%`);
        } else {
          console.log("Brightness must be between 0 and 100");
        }
      } else if (parts[0] === "color" && parts.length === 3) {
        const color = parts[1];
        const isWhite = parts[2].toLowerCase() === "white";
        setColorOfStrip(ledStrip, hexToColor(color), isWhite);
        console.log(`Color set to ${color} with white: ${isWhite}`);
      } else if (parts[0] === "read") {
        try {
          const value = await ledStrip.writeCharacteristic.readAsync();
          console.log("Read value:", value);
        } catch (err) {
          console.error("Error reading characteristic:", err);
        }
      } else {
        console.log(
          "Invalid command. Use: 'power on/off', 'brightness <0-100>' or 'color <hex>'",
        );
      }
    }
  };

  processCommands();
});
