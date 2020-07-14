import { updateTheImage } from '../utils/updateImageSelector.js';

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
        let frame = evt.target.id.slice(-1);
        if (evt.detail.direction > 0) {
            if (stack[frame]['currentImageIdIndex'] < stack[frame]['imageIds'].length - 1) {
              stack[frame]['currentImageIdIndex'] += 1;
              updateTheImage(frame, stack[frame]['currentImageIdIndex']);
            }
          } else {
            if (stack[frame]['currentImageIdIndex'] > 0) {
              stack[frame]['currentImageIdIndex'] -= 1;
              updateTheImage(frame, stack[frame]['currentImageIdIndex']);
            }
        }
    }
}