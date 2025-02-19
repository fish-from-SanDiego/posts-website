const template = document.createElement('template');
// noinspection CssUnresolvedCustomProperty
template.innerHTML = `
<style>

:host {
    width: 58px;
    color: gray;
}

div {
    color: inherit;
    box-sizing: border-box;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 8px solid currentColor;
    animation:
            l20-1 var(--loader-spin-time, 0.8s) infinite linear alternate,
            l20-2 var(--loader-spin-time-doubled, 1.6s)  infinite linear;
}

.hidden {
    display: none;
}

@keyframes l20-1{
    0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
    12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
    25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
    50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
    62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
    75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
    100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
}

@keyframes l20-2{
    0%    {transform:scaleY(1)  rotate(0deg)}
    49.99%{transform:scaleY(1)  rotate(135deg)}
    50%   {transform:scaleY(-1) rotate(0deg)}
    100%  {transform:scaleY(-1) rotate(-135deg)}
}
</style>
<div></div>
`;

export class SpinningLoader extends HTMLElement {

    static get defaultSpinTimeSeconds() {
        return 0.8;
    }

    static get observedAttributes() {
        return ['loader-speed'];
    }

    constructor() {
        super();
        // attach to the Shadow DOM
        const root = this.attachShadow({mode: 'closed'});
        root.appendChild(template.content.cloneNode(true));
        this.loaderElement = root.querySelector('div');
    }

    get loaderSpeed() {
        return this.getAttribute('loader-speed');
    }

    set loaderSpeed(value) {
        this.setAttribute('loader-speed', value);
    }


    connectedCallback() {
        if (!this.loaderSpeed || +this.loaderSpeed !== +this.loaderSpeed) {
            this.loaderSpeed = 1;
        } else if (this.loaderSpeed <= 0) {
            this.loaderElement.classList.add('hidden');
            throw new Error('The loader speed must be higher than zero.');
        }
        this.updateLoaderAnimation();
        // this.dispatchEvent(new CustomEvent('loaderSpeedChanged', {detail: this.loaderSpeed}));
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal) {
            return;
        }

        switch (name) {
            case 'loader-speed':
                this.loaderSpeed = newVal;
                this.updateLoaderAnimation();
                break;
        }
    }

    updateLoaderAnimation() {
        this.loaderElement.style.setProperty('--loader-spin-time',
            `${SpinningLoader.defaultSpinTimeSeconds / this.loaderSpeed}s`);
        this.loaderElement.style.setProperty('--loader-spin-time-doubled',
            `${SpinningLoader.defaultSpinTimeSeconds * 2 / this.loaderSpeed}s`);
    }
}

window.customElements.define('spinning-loader', SpinningLoader);