import CSImage from '../utils/CSImage.js';
import updateTheImage from '../utils/updateImageSelector.js';
import highlightContainer from './highlightContainer.js';

export default function populateGrid(e) {
    let element = e.target;

    element.style.display = 'none';
    let div = document.createElement('div');
    div.classList = 'image delete';
    let container = element.parentElement;
    container.appendChild(div);

    const baseURL = document.getElementById('baseURL').innerHTML;
    const format = document.getElementById('format').innerHTML;
    const numFrames = parseInt(document.getElementById('numFrames').innerHTML, 10);
    const imgsPerFrame = parseInt(document.getElementById('imgsPerFrame').innerHTML, 10);
    const startingIndex = parseInt(document.getElementById('startingIndex').innerHTML, 10);
    let urlsOverTime = [];
    for (let i = 0; i < numFrames; i++) {
        urlsOverTime.push([]);
        for (let j = 0; j < imgsPerFrame; j++) {
            urlsOverTime[i].push(baseURL + '/' + '0'.repeat(1 - Math.floor(Math.log10(i + startingIndex))) + (i + startingIndex) + '/' + 'IM-' + '0'.repeat(3 - Math.floor(Math.log10(i + startingIndex))) + (i + startingIndex) + '-' + '0'.repeat(3 - Math.floor(Math.log10(i * imgsPerFrame + j + 1))) + (i * imgsPerFrame + j + 1) + '.' + format + '?raw=true');
        }
    }

    new CSImage.CSImage(div, urlsOverTime, document.getElementById('format').innerHTML);
    updateTheImage(div, 0, true);
    highlightContainer(div);
    element.removeEventListener('click', populateGrid);
    
}