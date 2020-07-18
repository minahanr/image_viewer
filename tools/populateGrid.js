import CSImage from '../utils/CSImage.js';
import updateTheImage from '../utils/updateImageSelector.js';

export default function populateGrid(e) {
    let element = e.target;
    let frame = e.target.classList.value.slice(-1);

    element.style.display = 'none';
    let div = document.createElement('div');
    div.classList = 'image delete';
    let container = element.parentElement;
    container.appendChild(div);

    let CSimage = new CSImage(div, document.getElementById('URLs').innerHTML.split(' '), document.getElementById('format').innerHTML);
    //CSimage.stack['imageIds'].forEach(imageId => cornerstone.loadAndCacheImage(fileFormats[CSimage.format] + imageId));
    updateTheImage(div, 0);

    element.removeEventListener('click', populateGrid);
}