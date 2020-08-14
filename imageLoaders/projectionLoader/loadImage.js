import CSImage from '../../utils/CSImage.js';
import getMinMax from '../../internal/getMinMax.js';
import generateLut from '../../internal/generateLut.js';
import generateColorLut from '../../internal/generateColorLut.js';
import getModalityLut from '../../internal/getModalityLut.js';
import getVOILut from '../../internal/getVOILut.js' 
import defineVariables from '../../utils/defineVariables.js';

export function loadCoaxialImage_1(imageId) {
    imageId = imageId.substring(imageId.indexOf(':') + 1);

    let colonIndex = imageId.indexOf(':');
    let format = imageId.substring(0, colonIndex + 1);
    imageId = imageId.substring(colonIndex + 1);
    colonIndex = imageId.indexOf(':');
    let layerIndex = parseInt(imageId.substr(0, colonIndex), 10);
    imageId = imageId.substring(colonIndex + 1);
    let timeIndex = parseInt(imageId.substr(0, colonIndex), 10);
    imageId = imageId.substring(colonIndex + 1);
    colonIndex = imageId.indexOf(':');
    let frame = parseInt(imageId.substr(0, colonIndex), 10);
    imageId = imageId.substring(imageId.indexOf(":") + 1);
    
    let element = document.getElementById(imageId);
    let CSimage = CSImage.instances().get(element);
    let promises = [];
    let newImage = {};
    let baseImage = {};

    let promiseImage = cornerstone.loadImage(format + CSimage.layers[layerIndex].baseStack[timeIndex].imageIds[0]).then(img => {
        baseImage = img;
        newImage = {
            imageId: frame,
            minPixelValue: undefined,
            maxPixelValue: undefined,
            slope: baseImage.slope,
            intercept: baseImage.intercept,
            windowCenter: baseImage.windowCenter,
            windowWidth: baseImage.windowWidth,
            getPixelData: undefined,
            getCanvas: baseImage.getCanvas,
            rows: CSimage.layers[layerIndex].baseStack[timeIndex].imageIds.length,
            columns: baseImage.columns,
            height: CSimage.layers[layerIndex].baseStack[timeIndex].imageIds.length,
            width: baseImage.columns,
            color: baseImage.color,
            lut: baseImage.lut, 
            rgba: baseImage.rgba,
            columnPixelSpacing: baseImage.columnPixelSpacing,
            rowPixelSpacing: undefined,
            invert: baseImage.invert,
            sizeInBytes: undefined,
            falseColor: baseImage.falseColor,
            origPixelData: undefined,
            stats: undefined,
            cachedLut: undefined,
            colormap: element.colormap,
            data: undefined
        };

        if (CSimage.layers[layerIndex].sliceThickness !== undefined) {
            newImage.rowPixelSpacing = CSimage.layers[layerIndex].sliceThickness;
        } else if (CSimage.layers[layerIndex].options.dataset.string !== undefined) {
            newImage.rowPixelSpacing = CSimage.layers[layerIndex].options.dataset.string('x00180050');
        }

        let pixelData = baseImage.getPixelData();
        if (pixelData instanceof Int16Array) {
            newImage.data = new Int16Array(newImage.rows * newImage.columns);
        } else if (pixelData instanceof Int8Array) {
            newImage.data = new Int8Array(newImage.rows * newImage.columns);
        } else if (pixelData instanceof Uint16Array) {
            newImage.data = new Uint16Array(newImage.rows * newImage.columns);
        } else if (pixelData instanceof Uint8Array) {
            newImage.data = new Uint8Array(newImage.rows * newImage.columns);
        }
        
        for (let i = 0; i < newImage.rows; i++) {
            promises.push(cornerstone.loadImage(defineVariables().fileFormats[CSimage.layers[layerIndex].format] + CSimage.layers[layerIndex].baseStack[timeIndex].imageIds[i]));
        }

        return Promise.all(promises);
    }).then(images => {

        let pixelData = baseImage.getPixelData();
        let colorMultiplier = 1;
        if (promiseImage.color) {
            colorMultiplier = 3;
            if (promiseImage.rgba) {
                colorMultiplier = 4;
            }
        }

        for(let i = 0; i < newImage.rows; i++) {            
            if (pixelData instanceof Int16Array) {
                newImage.data.set(new Int16Array(images[i].getPixelData().buffer, frame * newImage.columns * 2 * colorMultiplier, newImage.columns), i * newImage.columns);
            } else if (pixelData instanceof Int8Array) {
                newImage.data.set(new Int8Array(images[i].getPixelData().buffer, frame * newImage.columns * colorMultiplier, newImage.columns), i * newImage.columns);
            } else if (pixelData instanceof Uint16Array) {
                newImage.data.set(new Uint16Array(images[i].getPixelData().buffer, frame * newImage.columns * 2 * colorMultiplier, newImage.columns), i * newImage.columns);
            } else if (pixelData instanceof Uint8Array) {
                newImage.data.set(new Uint8Array(images[i].getPixelData().buffer, frame * newImage.columns * colorMultiplier, newImage.columns), i * newImage.columns);
            }
        }
        
        newImage.getPixelData = () => newImage.data;
        newImage.sizeInBytes = newImage.getPixelData().byteLength;
        let { min, max } = getMinMax(newImage.getPixelData());
        newImage.minPixelValue = min;
        newImage.maxPixelValue = max;
        return newImage;
    });

    return {
        promise: promiseImage,
        cancelFn: undefined
    };
}

export function loadCoaxialImage_2(imageId) {
    imageId = imageId.substring(imageId.indexOf(':') + 1);
    let colonIndex = imageId.indexOf(':');
    let format = imageId.substring(0, colonIndex + 1);
    imageId = imageId.substring(colonIndex + 1);
    colonIndex = imageId.indexOf(':');
    let layerIndex = parseInt(imageId.substr(0, colonIndex), 10);
    imageId = imageId.substring(colonIndex + 1);
    let timeIndex = parseInt(imageId.substr(0, colonIndex), 10);
    imageId = imageId.substring(colonIndex + 1);
    colonIndex = imageId.indexOf(':');
    let frame = parseInt(imageId.substr(0, colonIndex), 10);
    imageId = imageId.substring(imageId.indexOf(":") + 1);
    
    let element = document.getElementById(imageId);
    let CSimage = CSImage.instances().get(element);
    let promises = [];
    let newImage = {};
    let baseImage = {};

    let promiseImage = cornerstone.loadImage(format + CSimage.layers[layerIndex].baseStack[timeIndex].imageIds[0]).then(img => {
        baseImage = img;
        newImage = {
            imageId: frame,
            minPixelValue: undefined,
            maxPixelValue: undefined,
            slope: baseImage.slope,
            intercept: baseImage.intercept,
            windowCenter: baseImage.windowCenter,
            windowWidth: baseImage.windowWidth,
            getPixelData: undefined,
            getCanvas: baseImage.getCanvas,
            rows: CSimage.layers[layerIndex].baseStack[timeIndex].imageIds.length,
            columns: baseImage.rows,
            height: CSimage.layers[layerIndex].baseStack[timeIndex].imageIds.length,
            width: baseImage.rows,
            color: baseImage.color,
            lut: baseImage.lut, 
            rgba: baseImage.rgba,
            columnPixelSpacing: baseImage.columnPixelSpacing,
            rowPixelSpacing: undefined,
            invert: baseImage.invert,
            sizeInBytes: undefined,
            falseColor: baseImage.falseColor,
            origPixelData: undefined,
            stats: undefined,
            cachedLut: undefined,
            colormap: element.colormap
        };

        if (CSimage.layers[layerIndex].sliceThickness !== undefined) {
            newImage.rowPixelSpacing = CSimage.layers[layerIndex].sliceThickness;
        } else if (CSimage.layers[layerIndex].options.dataset.string !== undefined) {
            newImage.rowPixelSpacing = CSimage.layers[layerIndex].options.dataset.string('x00180050');
        }

        let pixelData = baseImage.getPixelData();
        if (pixelData instanceof Int16Array) {
            newImage.data = new Int16Array(newImage.rows * newImage.columns);
        } else if (pixelData instanceof Int8Array) {
            newImage.data = new Int8Array(newImage.rows * newImage.columns);
        } else if (pixelData instanceof Uint16Array) {
            newImage.data = new Uint16Array(newImage.rows * newImage.columns);
        } else if (pixelData instanceof Uint8Array) {
            newImage.data = new Uint8Array(newImage.rows * newImage.columns);
        }
        
        for (let i = 0; i < newImage.rows; i++) {
            promises.push(cornerstone.loadImage(defineVariables().fileFormats[CSimage.layers[layerIndex].format] + CSimage.layers[layerIndex].baseStack[timeIndex].imageIds[i]));
        }
        return Promise.all(promises);
    }).then(images => {

        let pixelData = baseImage.getPixelData();
        let colorMultiplier = 1;
        if (promiseImage.color) {
            colorMultiplier = 3;
            if (promiseImage.rgba) {
                colorMultiplier = 4;
            }
        }

        for(let i = 0; i < newImage.rows; i++) {            
            if (pixelData instanceof Int16Array) {
                newImage.data.set(new Int16Array(images[i].getPixelData().buffer, frame * newImage.columns * 2 * colorMultiplier, newImage.columns), i * newImage.columns);
            } else if (pixelData instanceof Int8Array) {
                newImage.data.set(new Int8Array(images[i].getPixelData().buffer, frame * newImage.columns * colorMultiplier, newImage.columns), i * newImage.columns);
            } else if (pixelData instanceof Uint16Array) {
                newImage.data.set(new Uint16Array(images[i].getPixelData().buffer, frame * newImage.columns * 2 * colorMultiplier, newImage.columns), i * newImage.columns);
            } else if (pixelData instanceof Uint8Array) {
                newImage.data.set(new Uint8Array(images[i].getPixelData().buffer, frame * newImage.columns * colorMultiplier, newImage.columns), i * newImage.columns);
            }
        }

        newImage.getPixelData = () => newImage.data;
        newImage.sizeInBytes = newImage.getPixelData().byteLength;
        let { min, max } = getMinMax(newImage.getPixelData());
        newImage.minPixelValue = min;
        newImage.maxPixelValue = max;
        return newImage;
    });

    return {
        promise: promiseImage,
        cancelFn: undefined
    };
}

