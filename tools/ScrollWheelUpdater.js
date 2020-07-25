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
            if (CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex < CSimage.stack[CSimage.currentTimeIndex].imageIds.length - 1) {
                updateTheImage(evt.target, CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex + 1);
            }
        } else {
            if (CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex > 0) {
                updateTheImage(evt.target, CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex - 1);
            }
        }
    }
}