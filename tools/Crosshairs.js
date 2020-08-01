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
        cornerstoneTools.drawLine(context, CSimage.element, {x: -99999, y: location.y}, {x: location.x - 30 / viewport.displayedArea.columnPixelSpacing, y: location.y}, {color: 'greenyellow', lineWidth: 2 / viewport.displayedArea.rowPixelSpacing});
        cornerstoneTools.drawLine(context, CSimage.element, {x: location.x + 30 / viewport.displayedArea.columnPixelSpacing, y: location.y}, {x: 99999, y: location.y}, {color: 'greenyellow', lineWidth: 2 / viewport.displayedArea.rowPixelSpacing});
        cornerstoneTools.drawLine(context, CSimage.element, {x: location.x, y: -99999}, {x: location.x, y: location.y - 30 / viewport.displayedArea.rowPixelSpacing}, {color: 'greenyellow', lineWidth: 2 / viewport.displayedArea.columnPixelSpacing});
        cornerstoneTools.drawLine(context, CSimage.element, {x: location.x, y: location.y + 30 / viewport.displayedArea.rowPixelSpacing}, {x: location.x, y: 99999}, {color: 'greenyellow', lineWidth: 2 / viewport.displayedArea.columnPixelSpacing});
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
        this.enabled = false;
    }

    _chooseLocation(evt) {
        const eventData = evt.detail;
        let imageX = Math.round(eventData.currentPoints.image.x);
        let imageY = Math.round(eventData.currentPoints.image.y);
        let curImg = cornerstone.getImage(evt.target);
        evt.target.classList.add('hideCursor');

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

        this.baseImage = CSImage.instances.get(evt.target);
        let frame = this.baseImage.currentImageIdIndex;
        let projection = this.baseImage.projection;

        if (Synchronizer.instances.has(this.baseImage)) {
            this.synchronizer = Synchronizer.instances.get(this.baseImage);
        } else {
            this.synchronizer = undefined;
        }
        

        if (projection === '') {
            this.syncX = imageX;
            this.syncY = imageY;
            this.syncZ = frame;
        } else if (projection === 'LCI1:') {
            this.syncX = imageX;
            this.syncY = frame;
            this.syncZ = imageY;
        } else {
            this.syncX = frame;
            this.syncY = imageX;
            this.syncZ = imageY;
        }

        if (this.synchronizer !== undefined) {
            this.synchronizer.images.forEach(CSimage => {
                if (CSimage.projection === '') {
                    updateTheImage(CSimage.element, this.syncZ);
                } else if (CSimage.projection === 'LCI1:') {
                    updateTheImage(CSimage.element, this.syncY);
                } else if (CSimage.projection === 'LCI2:') {
                    updateTheImage(CSimage.element, this.syncX);
                }
            });
        } else {
            updateTheImage(this.baseImage.element, this.syncZ);
        }

        if (this.enabled === false) {
            this.enabled = true;
            this.drawCrosshairOnProjections();
        }
    }

    mouseUpCallback(evt) {
        this.enabled = false;

        // this.synchronizer.images.forEach(CSimage => {
        //     updateTheImage(CSimage.element, CSimage.currentImageIdIndex);
        // })

        evt.target.classList.remove('hideCursor');
    }

    drawCrosshairOnProjections() {
        if (this.synchronizer !== undefined) {
            this.synchronizer.images.forEach(CSimage => {
                let projection = CSimage.projection;
                let canvas = CSimage.element.getElementsByTagName('canvas')[0];
                let context = cornerstoneTools.getNewContext(canvas);
                context.setTransform(1, 0, 0, 1, 0, 0);
                if (projection === '') {
                    drawCrosshair(context, CSimage, {x: this.syncX, y: this.syncY});
                } else if (projection === 'LCI1:') {
                    drawCrosshair(context, CSimage, {x: this.syncX, y: this.syncZ});
                } else if (projection === 'LCI2:') {
                    drawCrosshair(context, CSimage, {x: this.syncY, y: this.syncZ});
                }
            });
        } else {
            let canvas = this.baseImage.element.getElementsByTagName('canvas')[0];
            let context = cornerstoneTools.getNewContext(canvas);
            drawCrosshair(context, this.baseImage, {x: this.syncX, y: this.syncY});
        }
        
        if (this.enabled) {
            cornerstone.requestAnimationFrame(this.drawCrosshairOnProjections.bind(this));
        }
    }
}