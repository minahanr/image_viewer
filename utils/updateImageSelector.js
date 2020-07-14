export function updateTheImage(frame, imageIndex) {
    stack[frame]['currentImageIdIndex'] = imageIndex;
    var element = document.getElementById('image_' + frame);
    cornerstone.loadImage(fileFormats[formats[frame]] + stack[frame]['imageIds'][stack[frame]['currentImageIdIndex']]).then(function(image) {
        let prev_viewport = cornerstone.getViewport(element);
        var new_viewport = cornerstone.getDefaultViewportForImage(element, image);

        if (prev_viewport !== undefined) {
            new_viewport.scale = prev_viewport.scale;
            new_viewport.translation = prev_viewport.translation;
        }

        cornerstone.displayImage(element, image, new_viewport);
    });
    updateImageSelector(frame); 
}

export function updateImageSelector(frame) {
    document.getElementById('image_' + frame).parentElement.getElementsByClassName('text')[0].innerHTML = (stack[frame]['currentImageIdIndex'] + 1) + '/' + numImages[frame];
}