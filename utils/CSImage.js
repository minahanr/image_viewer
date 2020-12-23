import loadTools from './loadTools.js';
import interpolate from '../tools/interpolate.js';
import playMovie from '../tools/playMovie.js';
import deleteImageFn from '../tools/deleteImageFn.js';
import loadStackProjection from '../imageLoaders/projectionLoader/loadStackProjection.js';
import changeTimeFrame from '../tools/changeTimeFrame.js';
import highlightContainer from '../tools/highlightContainer.js';
import Layer from './Layer.js';
import ActiveTools from './activeTools.js';

function instances() {
    if (instances.map === undefined) {
        instances.map = new WeakMap();
    }

    return instances.map;
}

function UUID_incrementer() {

    if (UUID_incrementer.uid === undefined) {
        UUID_incrementer.uid = 0;
    }

    return UUID_incrementer.uid++;
}

function activeTools() {
    if (activeTools.tools === undefined) {
        activeTools.tools = new ActiveTools('Pan', 'Zoom');
    }

    return activeTools.tools;
}

function highlightedElement(element) {
    if (element !== undefined) {
        highlightedElement.element = element;
    }

    return highlightedElement.element;
}

function highlightedContainer(container) {
    if (container !== undefined) {
        highlightedContainer.container = container;
    }

    return highlightedContainer.container;
}

function highlightedLayer(layer) {
    if (layer !== undefined) {
        highlightedLayer.layer = layer;
    }

    return highlightedLayer.layer;
}

class CSImage {
    constructor(element, urlsOverTime, format, baseURL, options) {
        if (options === undefined) {
            options = {};
        }

        cornerstone.enable(element);
        
        this.movieReverse = false;
        this.element = element;
        this.projection = 'frontal';
        this.currentTimeIndex = 0;
        this.currentImageIdIndex = 0;
        this.layers = [];
        this.lastSpaceIndex = 0;
        this.lastTimeIndex = 0;
        this.layerNumber = 1;

        instances().set(element, this);

        let container = element.parentElement;
        let topLeft = document.createElement('div');
        //let topRight = document.createElement('div');
        let botRight = document.createElement('div');
        let bot = document.createElement('div');
        let movieButton = document.createElement('img');
        let text = document.createElement('div');
        let interpolation = document.createElement('div');
        // let patientName = document.createElement('div');
        // let series = document.createElement('div');
        // let modality = document.createElement('div');
        // let date = document.createElement('div');
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
            this.addLayer(format, urlsOverTime, baseURL, { name: options.name, sliceThickness: options.sliceThickness });
        }

        topLeft.classList = 'overlay topLeft';
        //topRight.classList = 'overlay topRight';
        bot.classList = 'overlay bot';
        botRight.classList = 'overlay botRight delete';
        text.classList = 'text item';
        movieButton.classList = 'imageOverlay item button';
        deleteImage.classList = 'imageOverlay item button';
        this.timeSlider.classList = 'slider timeSlider';

        //patientName.innerHTML = 'patientName: ';
        //series.innerHTML = 'series: ';
        //modality.innerHTML = 'modality: ';
        //date.innerHTML = 'date: ';
        deleteImage.src = './images/delete.png';
        element.style.borderRadius = '0';
        movieButton.src =  './images/playButton.png';
        interpolation.innerHTML = 'interpolation';
        projection.innerHTML = 'projection';
        
        element.appendChild(topLeft);
        // element.appendChild(topRight);
        element.appendChild(bot);
        container.appendChild(botRight);
        topLeft.appendChild(movieButton);
        topLeft.appendChild(text);
        topLeft.appendChild(interpolation);
        topLeft.appendChild(projection);
        // topRight.appendChild(patientName);
        // topRight.appendChild(series);
        // topRight.appendChild(modality);
        //topRight.appendChild(date);
        bot.appendChild(this.timeSlider);
        botRight.appendChild(deleteImage);
                
        loadTools(element);
        
        interpolation.addEventListener('click', interpolate);
        movieButton.addEventListener('click', playMovie);
        deleteImage.addEventListener('click', deleteImageFn);
        projection.addEventListener('click', loadStackProjection);
        this.timeSlider.addEventListener('input', changeTimeFrame);

        this.element.getElementsByTagName('canvas')[0].addEventListener('click', evt => {
            evt.stopPropagation();

            highlightContainer(evt.target.parentElement)
        });

        ([topLeft, /*topRight, */bot, botRight]).forEach(element => {
            element.addEventListener('mousedown', evt => evt.stopPropagation());
        });

        
        element.id = 'image_' + UUID_incrementer();
    }

    addLayer(format, urlsOverTime, baseURL, options) {
        let layer = new Layer.Layer(this.layerNumber - 1, 'Layer #' + this.layerNumber, format, urlsOverTime, baseURL, options)
        this.layerNumber += 1;
        
        this.layers.push(layer);
        
        if (layer.stack[0].imageIds.length + layer.startingSpaceIndex > this.lastSpaceIndex) {
            this.lastSpaceIndex = layer.stack[0].imageIds.length + layer.startingSpaceIndex - 1;
        }

        if (layer.stack.length + layer.startingTimeIndex > this.lastTimeIndex) {
            this.lastTimeIndex = layer.stack.length + layer.startingTimeIndex - 1;
        }

        //this.timeSlider.max = urlsOverTime.length - 1;
        if (urlsOverTime.length === 1) {
            this.timeSlider.style.display = 'none';
        } else {
            this.timeSlider.style.display = 'block';
        }

        cornerstoneTools.addStackStateManager(this.element, ['stack']);
        cornerstoneTools.addToolState(this.element, 'stack', this.layers[this.layers.length - 1].stack[this.currentTimeIndex]);
    }
}

const obj = {
    CSImage,
    instances,
    UUID_incrementer,
    activeTools,
    highlightedElement,
    highlightedContainer,
    highlightedLayer
};

export default obj;