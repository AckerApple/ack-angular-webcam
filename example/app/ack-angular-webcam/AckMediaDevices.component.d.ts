import { EventEmitter } from '@angular/core';
export interface device {
}
export declare class AckMediaDevices {
    array: device[];
    arrayChange: EventEmitter<device[]>;
    error: EventEmitter<Event>;
    errorChange: EventEmitter<Event>;
    catcher: EventEmitter<Event>;
    ngOnInit(): void;
    loadDevices(): Promise<device[]>;
}
