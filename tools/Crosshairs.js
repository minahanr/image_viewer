import CSImage from "../utils/CSImage.js";
import Synchronizer from './Synchronizer.js';
import updateTheImage from "../utils/updateImageSelector.js";
cornerstoneTools.BaseTool = cornerstoneTools.importInternal('base/BaseTool');
cornerstoneTools.drawLine = cornerstoneTools.importInternal('drawing/drawLine');
cornerstoneTools.drawLines = cornerstoneTools.importInternal('drawing/drawLines');
cornerstoneTools.draw = cornerstoneTools.importInternal('drawing/draw');
cornerstoneTools.getNewContext = cornerstoneTools.importInternal('drawing/getNewContext');

function drawCrosshair(context, CSimage, location) {
    cornerstoneTools.draw(context, context => {
        const viewport = cornerstone.getViewport(CSimage.element);
        cornerstoneTools.drawLine(context, CSimage.element, {x: -99999, y: location.y}, {x: location.x - 30 / viewport.displayedArea.columnPixelSpacing, y: location.y}, {color: 'greenyellow', lineWidth: 2 / viewport.displayedArea.rowPixelSpacing}, 'canvas');
        cornerstoneTools.drawLine(context, CSimage.element, {x: location.x + 30 / viewport.displayedArea.columnPixelSpacing, y: location.y}, {x: 99999, y: location.y}, {color: 'greenyellow', lineWidth: 2 / viewport.displayedArea.rowPixelSpacing}, 'canvas');
        cornerstoneTools.drawLine(context, CSimage.element, {x: location.x, y: -99999}, {x: location.x, y: location.y - 30 / viewport.displayedArea.rowPixelSpacing}, {color: 'greenyellow', lineWidth: 2 / viewport.displayedArea.columnPixelSpacing}, 'canvas');
        cornerstoneTools.drawLine(context, CSimage.element, {x: location.x, y: location.y + 30 / viewport.displayedArea.rowPixelSpacing}, {x: location.x, y: 99999}, {color: 'greenyellow', lineWidth: 2 / viewport.displayedArea.columnPixelSpacing}, 'canvas');
    });
}
export default class ModifiedCrosshairsTool extends cornerstoneTools.BaseTool {
    constructor(props = {}) {
        const defaultProps = {
          name: 'ModifiedCrosshairs',
          supportedInteractionTypes: ['Mouse'],
        };
    
        super(Object.assign(props, defaultProps));
    
        this.mouseDownCallback = this._chooseLocation.bind(this);
        this.mouseClickCallback = this._chooseLocation.bind(this);
        this.mouseDragCallback = this._chooseLocation.bind(this);
        }

    _chooseLocation(evt) {
        const eventData = evt.detail;
        let imageX = Math.round(eventData.currentPoints.image.x);
        let imageY = Math.round(eventData.currentPoints.image.y);
        let curImg = cornerstone.getImage(evt.target);

        if (imageX < 0) {
            imageX = 0;
        }
        if (imageY < 0) {
            imageY = 0;
        }
        if (imageY >= curImg.rows) {
            imageY = curImg.rows - 1;
        }
        if (imageX >= curImg.columns) {
            imageX = curImg.columns - 1;
        }
        let syncX, syncY, syncZ = 0;
        let baseImage = CSImage.instances.get(evt.target);
        let frame = baseImage.stack[baseImage.currentTimeIndex].currentImageIdIndex;
        let synchronizer = Synchronizer.instances.get(baseImage);
        let projection = baseImage.projection;

        if (projection === '') {
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
            projection = CSimage.projection;
            let canvas = CSimage.element.getElementsByTagName('canvas')[0];
            let context = cornerstoneTools.getNewContext(canvas);
            context.setTransform(1, 0, 0, 1, 0, 0);
            if (projection === '') {
                updateTheImage(CSimage.element, syncZ, true).then(() => {
                    drawCrosshair(context, CSimage, {x: syncX, y: syncY});
                }).catch(e => console.log(e));
            } else if (projection === 'LCI1:') {
                updateTheImage(CSimage.element, syncY, true).then(() => {
                    drawCrosshair(context, CSimage, {x: syncX, y: syncZ});
                });
            } else if (projection === 'LCI2:') {
                updateTheImage(CSimage.element, syncX, true).then(() => {
                    drawCrosshair(context, CSimage, {x: syncY, y: syncZ});
                }).catch(e => console.log(e));
            }
        });
    }

    mouseUpCallback(evt) {
        let baseImage = CSImage.instances.get(evt.target);
        let synchronizer = Synchronizer.instances.get(baseImage);

        synchronizer.images.forEach(CSimage => {
            updateTheImage(CSimage.element, CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex);
        })
    }

}