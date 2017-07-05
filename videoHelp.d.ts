import { EventEmitter } from "@angular/core";
/**
 * Component options structure interface
 */
export interface Options {
    video: boolean | any;
    cameraType: string;
    audio: boolean;
    width: number;
    height: number;
    fallback: boolean;
    fallbackSrc: string;
    fallbackMode: string;
    fallbackQuality: number;
}
export interface VideoObject {
    capture: Function;
    save: Function;
    appendChild: Function;
    classid?: string;
    data?: {};
}
export interface Canvas {
    toDataURL: Function;
    getContext: Function;
    width: any;
    height: any;
}
export declare function dataUriToBlob(dataURI: any): Blob;
/** single image to transmittable resource */
export declare function dataUriToFormData(dataURI: any, options?: {
    fileName?: string;
    form?: FormData;
}): FormData;
export declare function drawImageArrayToCanvas(imgArray: string[]): Canvas;
export declare class Fallback {
    debug: Function;
    onCapture: Function;
    onSave: Function;
    videoObject: VideoObject;
    onImage: EventEmitter<{}>;
    constructor(videoObject: VideoObject);
    captureToCanvas(): Promise<Canvas>;
    captureBase64(mime?: any): Promise<string>;
    /**
     * Add <param>'s into fallback object
     * @param cam - Flash web camera instance
     * @returns {void}
     */
    addFallbackParams(options: Options): any;
}
