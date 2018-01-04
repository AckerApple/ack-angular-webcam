import { ElementRef, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Options, Fallback } from "./videoHelp";
export interface vidElmOptions {
    audio: boolean | MediaTrackConstraints;
    video: boolean | MediaTrackConstraints;
}
export declare class WebCamComponent {
    private sanitizer;
    private element;
    flashPlayer: Fallback;
    isSupportUserMedia: boolean;
    isSupportWebRTC: boolean;
    isFallback: boolean;
    observer: MutationObserver;
    onResize: () => any;
    stream: MediaStream;
    videoDevice: MediaDeviceInfo;
    videoDeviceId: string;
    facingMode: "user" | "enviroment" | "left" | "right" | string;
    mime: string;
    useParentWidthHeight: boolean;
    ref: WebCamComponent;
    refChange: EventEmitter<WebCamComponent>;
    options: Options;
    success: EventEmitter<{}>;
    error: Error;
    errorChange: EventEmitter<Error>;
    catcher: EventEmitter<Error>;
    constructor(sanitizer: DomSanitizer, element: ElementRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    afterInitCycles(): void;
    applyStream(stream: any): void;
    createVideoResizer(): void;
    applyDefaults(): void;
    onWebRTC(): Promise<MediaStream>;
    promiseVideoOptions(): Promise<MediaTrackConstraints>;
    resizeVideo(maxAttempts?: number): void;
    getVideoDimensions(video: any): {
        width: number;
        height: number;
    };
    getVideoElm(): any;
    setWebcam(options: Options): Promise<MediaStream>;
    promiseStreamByVidOptions(optionObject: vidElmOptions): Promise<MediaStream>;
    processSuccess(stream?: any): void;
    /**
     * Start capturing video stream
     * @returns {void}
     */
    startCapturingVideo(): Promise<any>;
    ngOnDestroy(): void;
    getCanvas(): HTMLCanvasElement;
    /** returns promise . @mime - null=png . Also accepts image/jpeg */
    getBase64(mime?: any): Promise<string>;
    setCanvasWidth(canvas?: any, video?: any): void;
    /** older browsers (IE11) cannot dynamically apply most attribute changes to object elements. Use this method during fallback */
    createVidElmOb(): HTMLObjectElement;
    setupFallback(): void;
    /** single image to FormData */
    captureAsFormData(options?: {
        mime?: string;
        fileName?: string;
        form?: FormData;
    }): Promise<FormData>;
    dataUriToFormData(base64: any, options: any): FormData;
}
