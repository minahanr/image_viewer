import CSImage from '../../utils/CSImage.js';
import getMinMax from '../../internal/getMinMax.js';
import defineVariables from '../../utils/defineVariables.js';

function loadFrontalImage(imageId, layer) {
    let colonIndex = imageId.indexOf(':');
    let URL = imageId.substring(colonIndex + 1);
    console.log(layer);
    
    return {
        promise: cornerstone.loadImage(URL),
        cancelFn: undefined
    }
}

function loadCoaxialImage(imageId, layer) {
    imageId = imageId.substring(imageId.indexOf(':') + 1);
    
    let slashIndex = imageId.lastIndexOf('/');
    let dashIndex = imageId.indexOf('-', slashIndex);
    let dotIndex = imageId.indexOf('.', slashIndex);
    let timeIndex = parseInt(imageId.substr(slashIndex + 1, dashIndex - slashIndex - 1), 10) - 1;
    let frame = parseInt(imageId.substr(dashIndex + 1, dotIndex - dashIndex - 1), 10) - 1;
    let promises = [];
    let newImage = {};
    let baseImage = {};

    let promiseImage = cornerstone.loadImage(defineVariables().fileFormats[layer.format] + layer.baseURL + '/frontal/' + layer.stack[timeIndex].imageIds[0]).then(img => {
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
            rows: layer.stack[timeIndex].imageIds.length,
            columns: baseImage.columns,
            height: layer.stack[timeIndex].imageIds.length,
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
            data: undefined
        };

        if (layer.colormap !== undefined) {
            newImage.colormap = layer.colormap;
        }
        
        if (layer.options.dataset.string !== undefined) {
            newImage.rowPixelSpacing = layer.options.dataset.string('x00180050');
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

        for (let i = 0; i < layer.stack[timeIndex].imageIds.length; i++) {
            promises.push(cornerstone.loadImage(defineVariables().fileFormats[layer.format] + layer.baseURL + '/frontal/' + layer.stack[timeIndex].imageIds[i]));
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
    }).catch(e => {
        console.log(e);
    });

    return {
        promise: promiseImage,
        cancelFn: undefined
    };
}

function loadSagitalImage(imageId, layer) {
    imageId = imageId.substring(imageId.indexOf(':') + 1);
    
    let slashIndex = imageId.lastIndexOf('/');
    let dashIndex = imageId.indexOf('-', slashIndex);
    let dotIndex = imageId.indexOf('.', slashIndex);
    let timeIndex = parseInt(imageId.substr(slashIndex + 1, dashIndex - slashIndex - 1), 10) - 1;
    let frame = parseInt(imageId.substr(dashIndex + 1, dotIndex - dashIndex - 1), 10) - 1;
    let promises = [];
    let newImage = {};
    let baseImage = {};

    let promiseImage = cornerstone.loadAndCacheImage(defineVariables().fileFormats[layer.format] + layer.baseURL + '/frontal/' + layer.stack[timeIndex].imageIds[0]).then(img => {
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
            rows: baseImage.height,
            columns: layer.stack[timeIndex].imageIds.length,
            height: baseImage.height,
            width: layer.stack[timeIndex].imageIds.length,
            color: baseImage.color,
            lut: baseImage.lut, 
            rgba: baseImage.rgba,
            columnPixelSpacing: undefined,
            rowPixelSpacing: baseImage.rowPixelSpacing,
            invert: baseImage.invert,
            sizeInBytes: undefined,
            falseColor: baseImage.falseColor,
            origPixelData: undefined,
            stats: undefined,
            cachedLut: undefined,
            
        };

        if (layer.colormap !== undefined) {
            newImage.colormap = layer.colormap;
        }

        if (layer.options.dataset.string !== undefined) {
            newImage.columnPixelSpacing = layer.options.dataset.string('x00180050');
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
        
        for (let i = 0; i < layer.stack[timeIndex].imageIds.length; i++) {
            promises.push(cornerstone.loadAndCacheImage(defineVariables().fileFormats[layer.format] + layer.baseURL + '/frontal/' + layer.stack[timeIndex].imageIds[i]));
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
            for (let j = 0; j < newImage.columns; j++) {            
                if (pixelData instanceof Int16Array) {
                    newImage.data.set(new Int16Array(images[j].getPixelData().buffer, (i * baseImage.columns + frame) * 2 * colorMultiplier, 1), i * newImage.columns + j);
                } else if (pixelData instanceof Int8Array) {
                    newImage.data.set(new Int8Array(images[j].getPixelData().buffer, (i * baseImage.columns + frame) * colorMultiplier, 1), i * newImage.columns + j);
                } else if (pixelData instanceof Uint16Array) {
                    newImage.data.set(new Uint16Array(images[j].getPixelData().buffer, (i * baseImage.columns + frame) * 2 * colorMultiplier, 1), i * newImage.columns + j);
                } else if (pixelData instanceof Uint8Array) {
                    newImage.data.set(new Uint8Array(images[j].getPixelData().buffer, (i * baseImage.columns + frame) * colorMultiplier, 1), i * newImage.columns + j);
                }
            }
        }

        newImage.getPixelData = () => newImage.data;
        newImage.sizeInBytes = newImage.getPixelData().byteLength;
        let { min, max } = getMinMax(newImage.getPixelData());
        newImage.minPixelValue = min;
        newImage.maxPixelValue = max;
        return newImage;
    }).catch(e => {
        console.log(e);
    });

    return {
        promise: promiseImage,
        cancelFn: undefined
    };
}

export { loadFrontalImage, loadCoaxialImage, loadSagitalImage };
