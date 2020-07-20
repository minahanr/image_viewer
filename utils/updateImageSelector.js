import CSImage from './CSImage.js';

function updateImageSelector(CSimage) {
    CSimage.element.parentElement.getElementsByClassName('text')[0].innerHTML = (CSimage.stack.currentImageIdIndex + 1) + '/' + CSimage.numImages;
}

export default function updateTheImage(element, imageIndex) {

    let CSimage = CSImage.instances.get(element);
    CSimage.stack.currentImageIdIndex = imageIndex;

    let prev_viewport = cornerstone.getViewport(element);
    cornerstone.loadImage(CSimage.projection + fileFormats[CSimage.format] + CSimage.stack.imageIds[CSimage.stack.currentImageIdIndex]).then(image => {
        
        var new_viewport = cornerstone.getDefaultViewportForImage(element, image);

        if (prev_viewport !== undefined) {
            new_viewport = prev_viewport;
        } else {
            new_viewport = cornerstone.getDefaultViewportForImage(element, image);
        }


        cornerstone.displayImage(element, image, new_viewport);
        cornerstoneTools.addStackStateManager(element, ['stack'])
        cornerstoneTools.addToolState(element, 'stack', CSimage.stack)
    });
    
    updateImageSelector(CSimage);
}

