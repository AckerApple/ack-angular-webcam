import { EventEmitter } from '@angular/core';
export declare class AckMediaDevices {
    array: MediaDeviceInfo[];
    arrayChange: EventEmitter<MediaDeviceInfo[]>;
    error: Error;
    errorChange: EventEmitter<Error>;
    catcher: EventEmitter<Error>;
    videoInputs: MediaDeviceInfo[];
    videoInputsChange: EventEmitter<MediaDeviceInfo[]>;
    audioInputs: MediaDeviceInfo[];
    audioInputsChange: EventEmitter<MediaDeviceInfo[]>;
    audioOutputs: MediaDeviceInfo[];
    audioOutputsChange: EventEmitter<MediaDeviceInfo[]>;
    ngOnInit(): void;
    loadDevices(): Promise<MediaDeviceInfo[]>;
    onDevices(devices: MediaDeviceInfo[]): AckMediaDevices;
}
