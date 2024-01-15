import { Component, OnInit, ElementRef, EventEmitter, Input, Output, isDevMode } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'webcam',
    templateUrl: 'webcam.html',
    styleUrls: ['webcam.css']
})

export class WebcamComponent implements OnInit {
    public videosrc: any;
    public output: any;
    public error: boolean = false;
    public errorMessage: string;
    @Input() canvasWidth: number = 300;
    @Input() canvasHeight: number = 220;
    @Output() onPhotoUpload = new EventEmitter();

    constructor(private sanitizer: DomSanitizer, private element: ElementRef) {
    }

    ngOnInit() {
        this.showCam();
    }

    showCam() {
        // 1. Casting necessary because TypeScript doesn't
        // know object Type 'navigator';
        let nav = <any>navigator;
        // 2. Adjust for all browsers
        nav.getUserMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;
        // 3. Trigger lifecycle tick (ugly, but works - see (better) Promise example below)
        //setTimeout(() => { }, 100);
        // 4. Get stream from webcam
        if (nav.getUserMedia) {
            nav.getUserMedia(
                { video: true },
                (stream) => {
                    let webcamUrl = URL.createObjectURL(stream);
                    // 4a. Tell Angular the stream comes from a trusted source
                    this.videosrc = this.sanitizer.bypassSecurityTrustUrl(webcamUrl);
                    // 4b. Start video element to stream automatically from webcam.
                    this.element.nativeElement.querySelector('video').autoplay = true;
                },
                (err) => this.handleCameraError(err));
            var promise = new Promise<string>((resolve, reject) => {
                nav.getUserMedia({ video: true }, (stream) => {
                    resolve(stream);
                }, (err) => reject(err));
            }).then((stream) => {
                let webcamUrl = URL.createObjectURL(stream);
                this.videosrc = this.sanitizer.bypassSecurityTrustResourceUrl(webcamUrl);
                // for example: type logic here to send stream to your  server and (re)distribute to
                // other connected clients.
            }).catch((err) => {
                this.handleCameraError(err);
            });
        }
        else {
            this.handleCameraError("MediaNotSupported");
        }
    }

    capturePhoto(video) {
        //let scale = 0.55;
        let canvas = document.createElement("canvas");
        //if (video.videoWidth > video.videoHeight) {
        canvas.width = this.canvasWidth; //video.videoWidth * scale;
        canvas.height = this.canvasHeight; //video.videoHeight * scale;
        //}
        //else {
        //    canvas.width = 220; //video.videoWidth * scale;
        //    canvas.height = 280; //video.videoHeight * scale;
        //}
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        if (canvas.toDataURL() && canvas.toDataURL() != "" && canvas.toDataURL() !== "data:,") {
            if (canvas.toDataURL() !== "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2NgYGD4DwABBAEAcCBlCwAAAABJRU5ErkJggg==") {
                this.output = canvas.toDataURL('image/jpeg', 1.0);
            }
            else {
                this.error = true;
                this.errorMessage = "Camera is busy with another program";
            }
        }
    }

    uploadPhoto() {
        this.onPhotoUpload.emit(this.output);
    }

    handleCameraError(err) {
        if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
            this.error = true;
            this.errorMessage = "Please plug in a camera";
        }
        else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            this.error = true;
            this.errorMessage = "Please allow camera to capture your photo";
        }
        else if (err.name === "NotReadableError" || err.name === "SourceUnavailableError") {
            this.error = true;
            this.errorMessage = "Camera is busy with another program";
        }
        else if (err === "MediaNotSupported") {
            this.error = true;
            this.errorMessage = "Camera not supported";
        }
        else {
            if (isDevMode) {
                console.error(err);
            }
            else {
                this.error = true;
                this.errorMessage = "Sorry, something went wrong";
            }
        }
    }
}