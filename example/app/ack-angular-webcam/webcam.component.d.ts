import { ElementRef, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as videoHelp from "./videoHelp";
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
    flashPlayer: videoHelp.Fallback;
    videoSrc: any;
    isSupportUserMedia: boolean;
    isSupportWebRTC: boolean;
    isFallback: boolean;
    browser: any;
    observer: any;
    onResize: any;
    stream: any;
    mime: string;
    ref: any;
    refChange: EventEmitter<{}>;
    options: videoHelp.Options;
    onSuccess: EventEmitter<{}>;
    onError: EventEmitter<{}>;
    constructor(sanitizer: DomSanitizer, element: ElementRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    getMedia(): any;
    afterInitCycles(): void;
    createVideoResizer(): void;
    applyDefaults(): void;
    /**
     * Switch to facing mode and setup web camera
     * @returns {void}
     */
    onWebRTC(): any;
    resizeVideo(): void;
    getVideoDimensions(video: any): {
        width: number;
        height: number;
    };
    getVideoElm(): any;
    /**
     * Setup web camera using native browser API
     * @returns {void}
     */
    setWebcam(): any;
    processSuccess(stream?: any): void;
    /**
     * Start capturing video stream
     * @returns {void}
     */
    startCapturingVideo(): any;
    ngOnDestroy(): void;
    getCanvas(): HTMLCanvasElement;
    /** returns promise . @mime - null=png . Also accepts image/jpeg */
    getBase64(mime?: any): Promise<string>;
    setCanvasWidth(canvas?: any, video?: any): void;
    /**
     * Implement fallback external interface
     */
    setupFallback(): void;
    /** single image to FormData */
    captureAsFormData(options?: {
        mime?: string;
        fileName?: string;
        form?: FormData;
    }): Promise<FormData>;
}
