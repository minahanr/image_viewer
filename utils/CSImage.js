import loadTools from './loadTools.js';
import interpolate from '../tools/interpolate.js';
import playMovie from '../tools/playMovie.js';
import showMetadataFn from '../tools/showMetadata.js';
import deleteImageFn from '../tools/deleteImageFn.js';
import loadStackProjection from '../imageLoaders/projectionLoader/loadStackProjection.js';
import getFileMetadata from '../tools/getFileMetadata.js';

export default class CSImage {
    constructor(element, URLs, format) {

        this.dataset = {};
        this.movieReverse = false;
        this.format = format;
        this.element = element;
        this.projection = '';
        this.numImages = URLs.length;
        this.stack = {
            currentImageIdIndex: 0,
            imageIds: URLs
        }
        
        CSImage.instances.set(element, this);

        let container = element.parentElement;
        let topLeft = document.createElement('div');
        let topRight = document.createElement('div');
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

        let projection = document.createElement('div');

        topLeft.classList = 'overlay topLeft';
        topRight.classList = 'overlay topRight';
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
        element.style.borderRadius = '0';
        movieButton.src =  './images/playButton.png';
        showMetadata.src = './images/metadata.png';
        interpolation.innerHTML = 'interpolation';
        projection.innerHTML = 'projection';
    
        element.appendChild(topLeft);
        element.appendChild(topRight);
        metadata.appendChild(metadataText);
        container.appendChild(botRight);
        topLeft.appendChild(movieButton);
        topLeft.appendChild(text);
        topLeft.appendChild(interpolation);
        topRight.appendChild(patientName);
        topRight.appendChild(series);
        topRight.appendChild(modality);
        topRight.appendChild(date);
        botRight.appendChild(showMetadata);
        botRight.appendChild(deleteImage);
        container.appendChild(metadata);
        topLeft.appendChild(projection);

        getFileMetadata(element);
        cornerstone.enable(element);
        loadTools(element);
        
        interpolation.addEventListener('click', interpolate);
        movieButton.addEventListener('click', playMovie);
        showMetadata.addEventListener('click', showMetadataFn);
        deleteImage.addEventListener('click', deleteImageFn);
        projection.addEventListener('click', loadStackProjection);
        
        element.id = 'image_' + CSImage.UUID_identifier;
        CSImage.UUID_identifier += 1;
    }

    static instances = new WeakMap();
    static UUID_identifier = 0;
}