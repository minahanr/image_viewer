import CSImage from '../utils/CSImage.js';
import updateTheImage from '../utils/updateImageSelector.js';

export default function populateGrid(e) {
    let element = e.target;
    let frame = e.target.classList.value.slice(-1);

    element.style.display = 'none';
    let div = document.createElement('div');
    div.classList = 'image delete';
    div.id = 'image_' + frame;
    let container = element.parentElement;
    container.appendChild(div);

    if (frame === '0')
        var CSimage = new CSImage(div, 'https://github.com/minahanr/image_viewer/blob/master/test_LungCT', 64, 'dcm', 'dicom')
    else
        var CSimage = new CSImage(div, 'https://github.com/minahanr/image_viewer/blob/master/test_NeckHeadCT', 113, 'dcm', 'dicom');

    CSimage.stack['imageIds'].forEach(imageId => cornerstone.loadAndCacheImage(imageId));
    updateTheImage(div, 0);

    element.removeEventListener('click', populateGrid);
}