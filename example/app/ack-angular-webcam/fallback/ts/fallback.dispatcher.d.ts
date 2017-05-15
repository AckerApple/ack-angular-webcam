/**
 * Action script fallback interface
 */
export interface ASCamera {
    capture: Function;
    save: Function;
    setCamera: Function;
    getCameraList: Function;
    width: number;
    height: number;
}
/**
 * Fallback external interface callback's
 */
export interface EventCallbacks {
    debug: Function;
    onCapture: Function;
    onTick: Function;
    onSave: Function;
}
/**
 * Adobe flash fallback dispatcher
 */
export declare class FallbackDispatcher {
    private cam;
    static implementExternal(callbacks: EventCallbacks): void;
    constructor(camera: ASCamera);
    capture(x?: any): any;
    save(x?: any): any;
    setCamera(x?: any): any;
    getCameraSize(): {
        width: number;
        height: number;
    };
    getCameraList(): any;
}
