import { Component, Input } from '@angular/core';

@Component({
    selector : 'loading-spinner',
    template: `
                <div id="loading" *ngIf="isLoadingSpinner">
                    <i class="fa fa-spinner fa-pulse fa-spin fa-5x fa-fw" id="loading-image"></i>
                    <span class="sr-only">Loading...</span>
                </div>
             `,
    styles: [`
                 #loading {
                    width: 100%;
                    height: 100%;
                    top: 0px;
                    left: 0px;
                    position: fixed;
                    display: block;
                    opacity: 0.7;
                    background-color: #fff;
                    z-index: 9999;
                    text-align: center;
                }
                #loading-image {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    margin: -60px 0 0 -60px;
                    z-index: 10000;
                }

            `]
})

export class LoadingSpinnerComponent
{
    @Input('is-loader-spinner') isLoadingSpinner: boolean = false;
}