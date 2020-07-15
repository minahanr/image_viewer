import CSImage from './CSImage.js';

function updateImageSelector(CSimage) {
    CSimage.element.parentElement.getElementsByClassName('text')[0].innerHTML = (CSimage.stack['currentImageIdIndex'] + 1) + '/' + CSimage.numImages;
}

export default function updateTheImage(element, imageIndex) {
    let CSimage = CSImage.instances.get(element);
    CSimage.stack['currentImageIdIndex'] = imageIndex;
    cornerstone.loadImage(fileFormats[CSimage.format] + CSimage.stack['imageIds'][CSimage.stack['currentImageIdIndex']]).then(function(image) {
        let prev_viewport = cornerstone.getViewport(element);
        var new_viewport = cornerstone.getDefaultViewportForImage(element, image);

        if (prev_viewport !== undefined) {
            new_viewport.scale = prev_viewport.scale;
            new_viewport.translation = prev_viewport.translation;
        }

        cornerstone.displayImage(element, image, new_viewport);
    });
    updateImageSelector(CSimage); 
}

