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

        this.baseImage = CSImage.instances().get(evt.target);
        let frame = this.baseImage.currentImageIdIndex;
        let projection = this.baseImage.projection;
        let synchronizer = Synchronizer.instances().get(CSImage.instances().get(this.element));

        if (synchronizer === undefined) {
            if (projection === '') {
                this.syncX = imageX;
                this.syncY = imageY;
                this.syncZ = frame;
            } else if (projection === 'LCI:') {
                this.syncX = imageX;
                this.syncY = frame;
                this.syncZ = imageY;
            } else {
                this.syncX = frame;
                this.syncY = imageX;
                this.syncZ = imageY;
            }
        } else {
            if (projection === '') {
                synchronizer.syncX = imageX;
                synchronizer.syncY = imageY;
                synchronizer.syncZ = frame;
            } else if (projection === 'LSI:') {
                synchronizer.syncX = imageX;
                synchronizer.syncY = frame;
                synchronizer.syncZ = imageY;
            } else {
                synchronizer.syncX = frame;
                synchronizer.syncY = imageX;
                synchronizer.syncZ = imageY;
            }
        }

        if (synchronizer !== undefined) {
            synchronizer.images.forEach(CSimage => {
                if (CSimage.projection === '') {
                    updateTheImage(CSimage.element, synchronizer.syncZ);
                } else if (CSimage.projection === 'LCI:') {
                    updateTheImage(CSimage.element, synchronizer.syncY);
                } else if (CSimage.projection === 'LSI:') {
                    updateTheImage(CSimage.element, synchronizer.syncX);
                }
            });
        } else {
            updateTheImage(this.baseImage.element, this.syncZ);
        }
    }

    mouseUpCallback(evt) {
        evt.target.classList.remove('hideCursor');
        let synchronizer = Synchronizer.instances().get(CSImage.instances().get(this.element));
        let CSimage = CSImage.instances().get(this.element);
        if (synchronizer === undefined) {
            this.syncX = undefined;
            this.syncY = undefined;
            this.syncZ = undefined;
        } else {
            synchronizer.syncX = undefined;
            synchronizer.syncY = undefined;
            synchronizer.syncZ = undefined;

            synchronizer.images.forEach(CSimage => {
                updateTheImage(CSimage.element, CSimage.currentImageIdIndex);
            });
        }


        
    }

    renderToolData(evt) {
        let CSimage = CSImage.instances().get(evt.detail.element);
        let synchronizer = Synchronizer.instances().get(CSImage.instances().get(evt.detail.element));

        if (synchronizer !== undefined && synchronizer.syncX === undefined && synchronizer.syncY === undefined && synchronizer.syncZ === undefined) {
            return;
        } else if (synchronizer === undefined && this.syncX === undefined && this.syncY === undefined && this.syncZ === undefined) {
            return;
        }

        if (synchronizer !== undefined) {
            let projection = CSimage.projection;
            let canvas = CSimage.element.getElementsByTagName('canvas')[0];
            let context = cornerstoneTools.getNewContext(canvas);
            context.setTransform(1, 0, 0, 1, 0, 0);
            if (projection === '') {
                drawCrosshair(context, CSimage, {x: synchronizer.syncX, y: synchronizer.syncY});
            } else if (projection === 'LCI:') {
                drawCrosshair(context, CSimage, {x: synchronizer.syncX, y: synchronizer.syncZ});
            } else if (projection === 'LSI:') {
                drawCrosshair(context, CSimage, {x: synchronizer.syncY, y: synchronizer.syncZ});
            }
        } else {
            let context = cornerstoneTools.getNewContext(evt.detail.canvasContext.canvas);
            drawCrosshair(context, CSimage, {x: this.syncX, y: this.syncY});
        }
    }
}