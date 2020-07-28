import CSImage from './CSImage.js';

function updateImageSelector(CSimage) {
    CSimage.element.parentElement.getElementsByClassName('text')[0].innerHTML = (CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex + 1) + '/' + CSimage.stack[CSimage.currentTimeIndex].imageIds.length;
}

export default function updateTheImage(element, imageIndex, sync) {

    let CSimage = CSImage.instances.get(element);
    CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex = imageIndex;
    updateImageSelector(CSimage);

    let promise = new Promise(() => {
        let promises = [];
        promises.push(cornerstone.loadAndCacheImage(CSimage.projection + fileFormats[CSimage.format] + CSimage.stack[CSimage.currentTimeIndex].imageIds[CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex]));
        Promise.all(promises).then(images => {
            cornerstone.getEnabledElement(element).layers = [];
            images.forEach((image, index) => {
                console.log(cornerstone.getEnabledElement(element).layers);
                cornerstone.addLayer(element, image, {});
                
                cornerstone.updateImage(element);

                cornerstoneTools.addStackStateManager(element, ['stack'])
                cornerstoneTools.addToolState(element, 'stack', CSimage.stack[CSimage.currentTimeIndex]);

                
            });

            return true;
        });
    });

    return promise;
}

