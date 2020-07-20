import CSImage from "../utils/CSImage.js";
import Synchronizer from './Synchronizer.js';
import updateTheImage from "../utils/updateImageSelector.js";

export default class ModifiedCrosshairsTool extends cornerstoneTools.CrosshairsTool {
    constructor(props = {}) {
        const defaultProps = {
          name: 'ModifiedCrosshairs',
          supportedInteractionTypes: ['Mouse'],
        };
    
        super(Object.assign(props, defaultProps));
    
        this.mouseDownCallback = this._chooseLocation.bind(this);
        this.mouseDragCallback = this._chooseLocation.bind(this);
        }

    _chooseLocation(evt) {
        const eventData = evt.detail;
        const imageX = Math.round(eventData.currentPoints.image.x);
        const imageY = Math.round(eventData.currentPoints.image.y);

        if (imageX < 0) {
            imageX = 0;
        }
        if (imageY < 0) {
            imageY = 0;
        }

        let syncX, syncY, syncZ = 0;
        let baseImage = CSImage.instances.get(evt.target);
        let frame = baseImage.stack.currentImageIdIndex;
        let synchronizer = Synchronizer.instances.get(baseImage);
        let projection = baseImage.projection || 'LCI0:';
        
        if (projection === 'LCI0:') {
            syncX = imageX;
            syncY = imageY;
            syncZ = frame;
        } else if (projection === 'LCI1:') {
            syncX = imageX;
            syncY = frame;
            syncZ = imageY;
        } else {
            syncX = frame;
            syncY = imageX;
            syncZ = imageY;
        }

        synchronizer.images.forEach(CSimage => {
            projection = CSimage.projection || 'LCS10:';
            if (projection === 'LCI0:') {
                updateTheImage(CSimage.element, syncZ);
            }
            if (projection === 'LCI1:') {
                if (syncY !== CSimage.stack.currentImageIdIndex) {
                    updateTheImage(CSimage.element, syncY);
                }
            } else if (projection === 'LCI2:') {
                if (syncX !== CSimage.stack.currentImageIdIndex) {
                    updateTheImage(CSimage.element, syncX);
                }
            }
        });
    }
}