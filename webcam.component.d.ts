import { ElementRef, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
/**
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
 */
export interface MediaDevice {
    deviceId: string;
    kind: string;
    label: string;
}
/**
 * Render WebCam Component
 */
export declare class WebCamComponent {
    private sanitizer;
    private element;
    flashPlayer: any;
    videoSrc: any;
    isSupportWebRTC: boolean;
    isFallback: boolean;
    browser: any;
    observer: any;
    onResize: any;
    ref: any;
    refChange: EventEmitter<{}>;
    options: Options;
    onSuccess: Function;
    onError: Function;
    constructor(sanitizer: DomSanitizer, element: ElementRef);
    ngAfterViewInit(): void;
    applyDefaults(): void;
    /**
     * Switch to facing mode and setup web camera
     * @returns {void}
     */
    onWebRTC(): any;
    resizeVideo(): void;
    getVideoDimensions(video: any): {
        width: any;
        height: any;
    };
    getVideoElm(): any;
    /**
     * Setup web camera using native browser API
     * @returns {void}
     */
    setWebcam(): any;
    processSuccess(stream?: any): void;
    /**
     * Add <param>'s into fallback object
     * @param cam - Flash web camera instance
     * @returns {void}
     */
    addFallbackParams(cam: any): any;
    /**
     * On web camera using flash fallback
     * .swf file is necessary
     * @returns {void}
     */
    onFallback(): any;
    /**
     * Start capturing video stream
     * @returns {void}
     */
    startCapturingVideo(): any;
    drawImageArrayToCanvas(imgArray: any): HTMLCanvasElement;
    ngOnDestroy(): void;
    getCanvas(): HTMLCanvasElement;
    /** returns promise . @mime - null=png . Also accepts image/jpeg */
    getBase64(mime?: any): Promise<any>;
    getFallbackBase64(mime: any): Promise<any>;
    setCanvasWidth(canvas?: any, video?: any): void;
    /**
     * Implement fallback external interface
     */
    setupFallback(): void;
}
