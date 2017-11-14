import { EventEmitter } from '@angular/core';
export interface device {
    deviceId: string;
    kind: "videoinput" | "audioinput" | string;
    label: string;
    groupId: string;
}
export declare class AckMediaDevices {
    array: device[];
    arrayChange: EventEmitter<device[]>;
    error: Error;
    errorChange: EventEmitter<Error>;
    catcher: EventEmitter<Error>;
    ngOnInit(): void;
    loadDevices(): Promise<device[]>;
}
