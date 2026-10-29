import { BeaconRoomProvider, RawBeaconSignal } from "@alibi/location";
import { DEFAULT_HOUSE_ROOMS } from "@alibi/contracts";

export class MobileNativeBridge {
  private beaconProvider: BeaconRoomProvider;

  constructor() {
    this.beaconProvider = new BeaconRoomProvider(DEFAULT_HOUSE_ROOMS);
  }

  public async initNativeBleScanning(): Promise<boolean> {
    try {
      // Dynamic import for Capacitor runtime
      const { BleClient } = await import("@capacitor-community/bluetooth-le");
      await BleClient.initialize();

      await BleClient.requestLEScan(
        {
          allowDuplicates: true,
        },
        (result) => {
          // Parse iBeacon payload (Apple manufacturer data 0x004c)
          if (result.device && result.rssi) {
            const signal: RawBeaconSignal = {
              uuid: result.device.deviceId,
              major: 1,
              minor: 1,
              rssi: result.rssi,
            };
            this.beaconProvider.processBeaconSignal(signal);
          }
        }
      );

      return true;
    } catch (err) {
      console.warn("[BLE NATIVE] Bluetooth scan not available in this environment. Using manual fallback.", err);
      return false;
    }
  }

  public getBeaconProvider(): BeaconRoomProvider {
    return this.beaconProvider;
  }
}
