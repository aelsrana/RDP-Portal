import { Component, Input } from '@angular/core';

@Component({
    selector : 'loading-image',
    template: `
                <div class="loader" id="loading" [ngClass]="{loaderDisplayBlock: isLoading, loaderDisplayNone: !isLoading}"></div>
             `,
    styles: [`
                .loaderDisplayBlock{
                     visibility: visible;
                }
                .loaderDisplayNone{
                    visibility: hidden;
                }
                .loader {
                      height: 2px;
                      width: 100%;
                      position: relative;
                      overflow: hidden;
                      background-color: #ddd;
                      bottom: 0px;
                }
                .loader:before{
                      position: absolute;
                      content: "";
                      left: -200px;
                      width: 200px;
                      height: 4px;
                      background-color: #A0D468;
                      animation: loading 2s linear infinite;
                }

                @keyframes loading {
                    from {left: -200px; width: 30%;}
                    50% {width: 30%;}
                    70% {width: 70%;}
                    80% { left: 50%;}
                    95% {left: 120%;}
                    to {left: 100%;}
                }

            `]
})

export class LoadingImageComponent
{
    @Input('is-loading') isLoading: boolean = false;
}