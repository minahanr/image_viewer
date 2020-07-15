import loadTools from './loadTools.js';
import interpolate from '../tools/interpolate.js';
import playMovie from '../tools/playMovie.js';
import showMetadataFn from '../tools/showMetadata.js';
import deleteImageFn from '../tools/deleteImageFn.js';

export default class CSImage {
    constructor(element, filePath, numImages, extension, format) {
        let max_str_len = Math.floor(Math.log10(numImages));

        this.format = format;
        this.movieReverse = false;
        this.element = element;
        this.numImages = numImages;
        this.stack = {
            currentImageIdIndex: 0,
            imageIds: []
        }
        for (let i = 1; i <= numImages; i++) {
            let i_str_len = Math.floor(Math.log10(i));
            let i_str = '0'.repeat(max_str_len - i_str_len) + i
    
            this.stack['imageIds'].push(filePath + '/' + 1 + '-' + i_str + '.' + extension + '?raw=true')
        }
        CSImage.instances.set(element, this);

        let container = element.parentElement;
        let topLeft = document.createElement('div');
        let topRight = document.createElement('div');
        let botLeftMetadata = document.createElement('div');
        let botLeftViewer = document.createElement('div');
        let botRight = document.createElement('div');
        let movieButton = document.createElement('img');
        let text = document.createElement('div');
        let metadataText = document.createElement('div');
        let interpolation = document.createElement('div');
        let showMetadata = document.createElement('img');
        let metadata = document.createElement('div');
        let patientName = document.createElement('div');
        let series = document.createElement('div');
        let modality = document.createElement('div');
        let date = document.createElement('div');
        let deleteImage = document.createElement('img');
        let switchMetadata = document.createElement('div');

        topLeft.classList = 'overlay topLeft';
        topRight.classList = 'overlay topRight';
        botLeftViewer.classList = 'overlay botLeft';
        botLeftMetadata.classList = 'overlay botLeft';
        botRight.classList = 'overlay botRight delete';
        text.classList = 'text item';
        movieButton.classList = 'imageOverlay item button';
        deleteImage.classList = 'imageOverlay item button';
        showMetadata.classList = 'imageOverlay item button';
        metadataText.classList = 'metadata-text';
        metadata.classList = 'metadata delete';

        patientName.innerHTML = 'patientName: ';
        series.innerHTML = 'series: ';
        modality.innerHTML = 'modality: ';
        date.innerHTML = 'date: ';
        deleteImage.src = './images/delete.png';
        switchMetadata.innerHTML = 'change metadata';
        element.style.borderRadius = '0';
        movieButton.src =  './images/playButton.png';
        showMetadata.src = './images/metadata.png';
        interpolation.innerHTML = 'interpolation';

        //experimenting
        switchMetadata.style.display = 'none';

        interpolation.addEventListener('click', interpolate);

        element.appendChild(topLeft);
        element.appendChild(topRight);
        element.appendChild(botLeftViewer);
        metadata.appendChild(metadataText);
        metadata.appendChild(botLeftMetadata);
        container.appendChild(botRight);
        topLeft.appendChild(movieButton);
        topLeft.appendChild(text);
        topLeft.appendChild(interpolation);
        topRight.appendChild(patientName);
        topRight.appendChild(series);
        topRight.appendChild(modality);
        topRight.appendChild(date);
        botLeftMetadata.appendChild(switchMetadata);
        botRight.appendChild(showMetadata);
        botRight.appendChild(deleteImage);
        container.appendChild(metadata);

        cornerstone.enable(element);
        loadTools(element);
        
        movieButton.addEventListener('click', playMovie);
        showMetadata.addEventListener('click', showMetadataFn);
        deleteImage.addEventListener('click', deleteImageFn);
        
    }

    static instances = new WeakMap();
}