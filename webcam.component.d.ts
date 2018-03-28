import { ElementRef, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Options, Fallback } from "./videoHelp";
export interface vidElmOptions {
    audio: boolean | MediaTrackConstraints;
    video: boolean | MediaTrackConstraints;
}
export interface elementSets {
    width: number;
    height: number;
}
export interface sets {
    element: elementSets;
}
export declare class WebCamComponent {
    private sanitizer;
    private element;
    flashPlayer: Fallback;
    isSupportUserMedia: boolean;
    isSupportWebRTC: boolean;
    isFallback: boolean;
    initComplete: boolean;
    observer: MutationObserver;
    onResize: () => any;
    stream: MediaStream;
    sets: sets;
    videoDevice: MediaDeviceInfo;
    videoDeviceId: string;
    reflect: boolean;
    facingMode: "user" | "environment" | "left" | "right" | string;
    mime: string;
    useParentWidthHeight: boolean;
    options: Options;
    success: EventEmitter<{}>;
    ref: WebCamComponent;
    refChange: EventEmitter<WebCamComponent>;
    error: Error;
    errorChange: EventEmitter<Error>;
    catcher: EventEmitter<Error>;
    constructor(sanitizer: DomSanitizer, element: ElementRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: any): void;
    ngOnDestroy(): void;
    play(): void;
    stop(): void;
    redraw(): void;
    afterInitCycles(): void;
    applyReflect(): void;
    applyStream(stream: any): void;
    createVideoResizer(): void;
    applyDefaults(): void;
    onWebRTC(): Promise<MediaStream>;
    promiseVideoOptions(): Promise<MediaTrackConstraints>;
    resizeVideo(maxAttempts?: number): void;
    resize(maxAttempts?: number): void;
    getVideoDimensions(video: any): {
        width: number;
        height: number;
    };
    getVideoElm(): any;
    setWebcam(options: Options): Promise<MediaStream>;
    catchError(err: Error): Promise<any>;
    promiseStreamByVidOptions(optionObject: vidElmOptions): Promise<MediaStream>;
    processSuccess(stream?: any): void;
    /**
     * Start capturing video stream
     * @returns {void}
     */
    startCapturingVideo(): Promise<any>;
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
