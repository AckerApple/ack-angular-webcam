import { EventEmitter } from '@angular/core';
export interface device {
}
export declare class WebCamComponent {
    array: device[];
    arrayChange: EventEmitter<device[]>;
    error: EventEmitter<Event>;
    errorChange: EventEmitter<Event>;
    ngOnInit(): void;
    loadDevices(): void;
}
