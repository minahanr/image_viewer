import CSImage from '../utils/CSImage.js';
import updateTheImage from '../utils/updateImageSelector.js';
import highlightContainer from './highlightContainer.js';
import parseArray from '../utils/parseArray.js';

export default function populateGrid(container, seriesIndex) {
    // container.getElementsByClassName('addImage')[0].style.display = 'none';
    let div = document.createElement('div');
    div.classList = 'image delete';
    // let container = element.parentElement;
    container.appendChild(div);
    let { urlsOverTime } = parseArray(seriesIndex);

    new CSImage.CSImage(div, urlsOverTime, imageSeries[seriesIndex].format);
    updateTheImage(div, 0);
    highlightContainer(div);
    
}