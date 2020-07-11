import updateImageSelector from '../utils/updateImageSelector.js';

export default class ScrollWheelUpdaterTool extends cornerstoneTools.StackScrollMouseWheelTool {
    constructor(props = {}) {
        const defaultProps = {
            name: 'ScrollWheelUpdater',
            supportedInteractionTypes: ['MouseWheel'],
            configuration: {
            loop: false,
            allowSkipping: true,
            invert: false,
            },
        };
        super(Object.assign(props, defaultProps));

    }

    mouseWheelCallback(evt) {
        super.mouseWheelCallback(evt);
        updateImageSelector(stack['currentImageIdIndex']);
    }
}