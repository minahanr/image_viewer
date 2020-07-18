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
        let CSimage = CSImage.instances.get(evt.target);
        if (evt.detail.direction > 0) {
            if (CSimage.stack.currentImageIdIndex < CSimage.numImages - 1) {
                CSimage.stack.currentImageIdIndex += 1;
                updateTheImage(evt.target, CSimage.stack.currentImageIdIndex);
            }
        } else {
            if (CSimage.stack.currentImageIdIndex > 0) {
                CSimage.stack.currentImageIdIndex -= 1;
                updateTheImage(evt.target, CSimage.stack.currentImageIdIndex);
            }
        }
    }
}