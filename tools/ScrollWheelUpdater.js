import updateTheImage from '../utils/updateImageSelector.js';
import CSImage from '../utils/CSImage.js';

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
        updateTheImage(evt.target, CSImage.instances.get(evt.target).stack['currentImageIdIndex']);
    }
}