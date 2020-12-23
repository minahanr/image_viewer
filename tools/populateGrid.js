import CSImage from '../utils/CSImage.js';
import updateTheImage from '../utils/updateImageSelector.js';
import highlightContainer from './highlightContainer.js';
import parseArray from '../utils/parseArray.js';

export default function populateGrid(container, seriesIndex, options) {
    let div = document.createElement('div');
    div.classList = 'image delete';
    container.appendChild(div);
    let { urlsOverTime } = parseArray(seriesIndex, 'frontal');

    new CSImage.CSImage(div, urlsOverTime, imageSeries[seriesIndex].format, imageSeries[seriesIndex].baseURL, { name: options.name });
    updateTheImage(div, 0);
    highlightContainer(div);
    
}