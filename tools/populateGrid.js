import CSImage from '../utils/CSImage.js';
import updateTheImage from '../utils/updateImageSelector.js';
import highlightContainer from './highlightContainer.js';
import parseArray from '../utils/parseArray.js';

export default function populateGrid(container, imageIndex) {
    // container.getElementsByClassName('addImage')[0].style.display = 'none';
    let div = document.createElement('div');
    div.classList = 'image delete';
    // let container = element.parentElement;
    container.appendChild(div);
    let { urlsOverTime } = parseArray(0);

    new CSImage.CSImage(div, urlsOverTime, document.getElementById('format').innerHTML);
    updateTheImage(div, 0);
    highlightContainer(div);
    
}