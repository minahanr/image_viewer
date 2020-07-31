import loadTools from './loadTools.js';
import interpolate from '../tools/interpolate.js';
import playMovie from '../tools/playMovie.js';
import deleteImageFn from '../tools/deleteImageFn.js';
import loadStackProjection from '../imageLoaders/projectionLoader/loadStackProjection.js';
import changeTimeFrame from '../tools/changeTimeFrame.js';
import highlightContainer from '../tools/highlightContainer.js';
import Layer from './Layer.js';
import ActiveTools from './activeTools.js';

export default class CSImage {
    constructor(element, urlsOverTime, format) {
        cornerstone.enable(element);

        this.movieReverse = false;
        this.element = element;
        this.projection = '';
        this.currentTimeIndex = 0;
        this.currentImageIdIndex = 0;
        this.layers = [];
        this.lastIndex = 0;
        this.layerNumber = 1;

        
        
        CSImage.instances.set(element, this);

        let container = element.parentElement;
        let topLeft = document.createElement('div');
        let topRight = document.createElement('div');
        let botRight = document.createElement('div');
        let bot = document.createElement('div');
        let movieButton = document.createElement('img');
        let text = document.createElement('div');
        let interpolation = document.createElement('div');
        let patientName = document.createElement('div');
        let series = document.createElement('div');
        let modality = document.createElement('div');
        let date = document.createElement('div');
        let deleteImage = document.createElement('img');
        let projection = document.createElement('div');
        this.timeSlider = document.createElement('input');
        this.timeSlider.style.display = 'none';

        this.timeSlider.type = 'range';
        this.timeSlider.min = 0;
        this.timeSlider.max = 0;

        this.timeSlider.step = 1;
        this.timeSlider.value = 0;

        if (urlsOverTime !== undefined) {
            this.addLayer(format, urlsOverTime, 0);
        }

        topLeft.classList = 'overlay topLeft';
        topRight.classList = 'overlay topRight';
        bot.classList = 'overlay bot';
        botRight.classList = 'overlay botRight delete';
        text.classList = 'text item';
        movieButton.classList = 'imageOverlay item button';
        deleteImage.classList = 'imageOverlay item button';
        this.timeSlider.classList = 'slider timeSlider';

        patientName.innerHTML = 'patientName: ';
        series.innerHTML = 'series: ';
        modality.innerHTML = 'modality: ';
        date.innerHTML = 'date: ';
        deleteImage.src = './images/delete.png';
        element.style.borderRadius = '0';
        movieButton.src =  './images/playButton.png';
        interpolation.innerHTML = 'interpolation';
        projection.innerHTML = 'projection';
        
        element.appendChild(topLeft);
        element.appendChild(topRight);
        element.appendChild(bot);
        container.appendChild(botRight);
        topLeft.appendChild(movieButton);
        topLeft.appendChild(text);
        topLeft.appendChild(interpolation);
        topLeft.appendChild(projection);
        topRight.appendChild(patientName);
        topRight.appendChild(series);
        topRight.appendChild(modality);
        topRight.appendChild(date);
        bot.appendChild(this.timeSlider);
        botRight.appendChild(deleteImage);
                
        loadTools(element);
        
        interpolation.addEventListener('click', interpolate);
        movieButton.addEventListener('click', playMovie);
        deleteImage.addEventListener('click', deleteImageFn);
        projection.addEventListener('click', loadStackProjection);
        this.timeSlider.addEventListener('input', changeTimeFrame);
        this.element.addEventListener('mousedown', evt => highlightContainer(this.element));

        ([topLeft, topRight, bot, botRight]).forEach(element => {
            element.addEventListener('mousedown', evt => evt.stopPropagation());
        });

        
        element.id = 'image_' + CSImage.UUID_identifier;
        CSImage.UUID_identifier += 1;
    }

    static instances = new WeakMap();
    static UUID_identifier = 0;
    static activeTools = new ActiveTools('Pan', 'Zoom');

    addLayer(format, urlsOverTime, startingIndex) {
        let layer = new Layer(this.layerNumber, 'Layer #' + this.layerNumber, format, urlsOverTime, startingIndex)
        this.layerNumber += 1;
        this.layers.push(layer);
        
        if (layer.stack[0].imageIds.length + layer.startingIndex > this.lastIndex) {
            this.lastIndex = layer.stack[0].imageIds.length + layer.startingIndex - 1;
        }

        this.timeSlider.max = urlsOverTime.length - 1;
        if (this.timeSlider.max === 0 || this.timeSlider.max === 1) {
            this.timeSlider.style.display = 'none';
        } else {
            this.timeSlider.style.display = 'block';
        }

        cornerstoneTools.addStackStateManager(this.element, ['stack']);
        cornerstoneTools.addToolState(this.element, 'stack', this.layers[this.layers.length - 1].stack[this.currentTimeIndex]);
    }
}