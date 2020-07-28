import loadTools from './loadTools.js';
import interpolate from '../tools/interpolate.js';
import playMovie from '../tools/playMovie.js';
import showMetadataFn from '../tools/showMetadata.js';
import deleteImageFn from '../tools/deleteImageFn.js';
import loadStackProjection from '../imageLoaders/projectionLoader/loadStackProjection.js';
import getFileMetadata from '../tools/getFileMetadata.js';
import changeTimeFrame from '../tools/changeTimeFrame.js';
import Layer from './Layer.js';

export default class CSImage {
    constructor(element, urlsOverTime, format) {

        this.dataset = {};
        this.movieReverse = false;
        this.format = format;
        this.element = element;
        this.projection = '';
        this.currentTimeIndex = 0;
        this.currentImageIdIndex = 0;
        this.layers = [];
        this.layers.push(new Layer(format, urlsOverTime, 0));
        if (urlsOverTime[0].currentImageIdIndex !== undefined){
            this.stack = urlsOverTime;
        } else {
            this.stack = [];
            urlsOverTime.forEach(urls => this.stack.push({imageIds: urls, currentImageIdIndex: 0}));
        }
        
        
        CSImage.instances.set(element, this);

        let container = element.parentElement;
        let topLeft = document.createElement('div');
        let topRight = document.createElement('div');
        let botRight = document.createElement('div');
        let bot = document.createElement('div');
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
        let timeSlider = document.createElement('input');

        topLeft.classList = 'overlay topLeft';
        topRight.classList = 'overlay topRight';
        bot.classList = 'overlay bot';
        botRight.classList = 'overlay botRight delete';
        text.classList = 'text item';
        movieButton.classList = 'imageOverlay item button';
        deleteImage.classList = 'imageOverlay item button';
        showMetadata.classList = 'imageOverlay item button';
        metadataText.classList = 'metadata-text';
        metadata.classList = 'metadata delete';
        timeSlider.classList = 'slider timeSlider';

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
        
        timeSlider.type = 'range';
        timeSlider.min = 0;
        timeSlider.max = urlsOverTime.length - 1;
        timeSlider.step = 1;
        timeSlider.value = 0;

        if (urlsOverTime.length === 1) {
            timeSlider.style.display = 'none';
        }
    
        element.appendChild(topLeft);
        element.appendChild(topRight);
        element.appendChild(bot);
        metadata.appendChild(metadataText);
        container.appendChild(botRight);
        topLeft.appendChild(movieButton);
        topLeft.appendChild(text);
        topLeft.appendChild(interpolation);
        topLeft.appendChild(projection);
        topRight.appendChild(patientName);
        topRight.appendChild(series);
        topRight.appendChild(modality);
        topRight.appendChild(date);
        bot.appendChild(timeSlider);
        botRight.appendChild(showMetadata);
        botRight.appendChild(deleteImage);
        container.appendChild(metadata);
        
        getFileMetadata(element);
        cornerstone.enable(element);
        loadTools(element);
        
        interpolation.addEventListener('click', interpolate);
        movieButton.addEventListener('click', playMovie);
        showMetadata.addEventListener('click', showMetadataFn);
        deleteImage.addEventListener('click', deleteImageFn);
        projection.addEventListener('click', loadStackProjection);
        timeSlider.addEventListener('input', changeTimeFrame);
        element.addEventListener('mousedown', evt => {
            document.getElementById('metadata-viewer').innerHTML = evt.target.parentElement.parentElement.getElementsByClassName('metadata-text')[0].innerHTML;
        });

        ([topLeft, topRight, bot, botRight]).forEach(element => {
            element.addEventListener('mousedown', evt => evt.stopPropagation());
        });

        
        element.id = 'image_' + CSImage.UUID_identifier;
        CSImage.UUID_identifier += 1;
    }

    static instances = new WeakMap();
    static UUID_identifier = 0;
}