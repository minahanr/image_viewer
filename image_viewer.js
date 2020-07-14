import parseTiff from './parsers/tiffParser/parseTiff.js';
import ScrollWheelUpdaterTool from './tools/ScrollWheelUpdater.js';
import updateTheImage from './utils/updateImageSelector.js';
import getFileMetadata from './getFileMetadata.js';
import CSImage from './utils/CSImage.js';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.init({
    mouseEnabled: true,
    showSVGcursors: false
});



function loadTools(element) {
    //load tools that are initially active
    cornerstoneTools.addToolForElement(element, cornerstoneTools.ZoomTool, {
        configuration: {
            invert: false,
            preventZoomOutsideImage: false,
        }
    });
    cornerstoneTools.setToolActiveForElement(element, 'Zoom', { mouseButtonMask: 2});

    cornerstoneTools.addToolForElement(element, cornerstoneTools.PanTool);
    cornerstoneTools.setToolActiveForElement(element, 'Pan', { mouseButtonMask: 1});
    
    cornerstoneTools.addStackStateManager(element, ['stack']);
    cornerstoneTools.addToolState(element, 'stack', stack[element.id.slice(-1)]);
    cornerstoneTools.addToolForElement(element, ScrollWheelUpdaterTool);
    cornerstoneTools.setToolActiveForElement(element, 'ScrollWheelUpdater', {});

    //load tools that are initially inactive
    cornerstoneTools.addToolForElement(element, cornerstoneTools['BrushTool']);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.MagnifyTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.RotateTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.WwwcTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.WwwcRegionTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.AngleTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.CobbAngleTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.EllipticalRoiTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.RectangleRoiTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.FreehandRoiTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.LengthTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.ProbeTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.ArrowAnnotateTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.BidirectionalTool);
}

var test = new XMLHttpRequest();
test.open('GET', 'https://github.com/minahanr/image_viewer/blob/master/test_tiff/1-01.tiff?raw=true', true);
test.responseType = 'blob';
test.onload = function(e) {
    if(this.status == 200) {
        let image = this.response.arrayBuffer().then(buffer => { 
            var Uint8View = new Uint8Array(buffer);
            var tags = parseTiff(Uint8View);
            for (let i = 0; i < supportedTags.length; i++) {
                console.log(supportedTags[i] + ': ' + tags.getMetadata(supportedTags[i]));
            }
        });
        
    }
}

test.send();

function createVariables_series1(frame) {
    let currentfileFormat = 'dcm';
    let filePath = 'https://github.com/minahanr/image_viewer/blob/master/test_NeckHeadCT';
    numImages.push(113);
    let max_str_len = Math.floor(Math.log10(numImages[numImages.length - 1]));
    
    stack.push({
        currentImageIdIndex: 0,
        imageIds: [],
    });

    for (let i = 1; i <= numImages[numImages.length - 1]; i++) {
        let i_str_len = Math.floor(Math.log10(i));
        let i_str = '0'.repeat(max_str_len - i_str_len) + i

        stack[stack.length - 1]['imageIds'].push(filePath + '/' + 1 + '-' + i_str + '.' + currentfileFormat + '?raw=true')
        movieReverse.push(false);
    }

    formats.push('dicom');
}

function createVariables_series2(frame) {
    let currentfileFormat = 'dcm';
    let filePath = 'https://github.com/minahanr/image_viewer/blob/master/test_LungCT';
    numImages.push(64);
    let max_str_len = Math.floor(Math.log10(numImages[numImages.length - 1]));
    
    stack.push({
        currentImageIdIndex: 0,
        imageIds: [],
    });

    for (let i = 1; i <= numImages[numImages.length - 1]; i++) {
        let i_str_len = Math.floor(Math.log10(i));
        let i_str = '0'.repeat(max_str_len - i_str_len) + i

        stack[stack.length - 1]['imageIds'].push(filePath + '/' + 1 + '-' + i_str + '.' + currentfileFormat + '?raw=true')
        movieReverse.push(false);
    }

    formats.push('dicom');
}

function createGrid(rows, cols) {
    let grid = document.getElementById('grid');

    for(let i = 0; i < rows * cols; i++) {
        let container = document.createElement('div');
        container.style.position = 'relative';
        container.classList = 'hasBorder image_' + i;
        container.style.height = "calc((100% - var(--toolbar-height)) / " + rows + ")";
        container.style.width = "calc(100% / " + cols + ")";
        grid.appendChild(container);
        
        let addImage = document.createElement('div');
        addImage.innerHTML = 'add image';
        addImage.classList = 'addImage image_' + i;
        container.appendChild(addImage);
        addImage.addEventListener('click', populateGrid);
    }
}

function populateGrid(e) {
    let element = e.target;
    let frame = e.target.classList.value.slice(-1);

    if (frame === '0')
        var CSimage = new CSImage(element, 'https://github.com/minahanr/image_viewer/blob/master/test_LungCT', 64, 'dcm', 'dicom')
    else
        var CSimage = new CSImage(element, 'https://github.com/minahanr/image_viewer/blob/master/test_NeckHeadCT', 113, 'dcm', 'dicom');

    element.style.display = 'none';
    let div = document.createElement('div');
    div.classList.add('image');
    div.id = 'image_' + frame;
    let container = element.parentElement;
    container.appendChild(div);

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
    let border = document.createElement('div');
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
    border.classList = 'border delete';

    patientName.innerHTML = 'patientName: ';
    series.innerHTML = 'series: ';
    modality.innerHTML = 'modality: ';
    date.innerHTML = 'date: ';
    deleteImage.src = './images/delete.png';
    switchMetadata.innerHTML = 'change metadata';
    div.style.borderRadius = '0';
    movieButton.src =  './images/playButton.png';
    showMetadata.src = './images/metadata.png';
    interpolation.innerHTML = 'interpolation';

    //experimenting
    switchMetadata.style.display = 'none';

    interpolation.addEventListener('click', interpolate);

    div.appendChild(topLeft);
    div.appendChild(topRight);
    div.appendChild(botLeftViewer);
    metadata.appendChild(metadataText);
    metadata.appendChild(botLeftMetadata);
    container.appendChild(botRight);
    topLeft.appendChild(movieButton);
    topLeft.appendChild(text);
    botLeftViewer.appendChild(interpolation);
    topRight.appendChild(patientName);
    topRight.appendChild(series);
    topRight.appendChild(modality);
    topRight.appendChild(date);
    botLeftMetadata.appendChild(switchMetadata);
    botRight.appendChild(showMetadata);
    botRight.appendChild(deleteImage);
    container.appendChild(border);
    container.appendChild(metadata);

    cornerstone.enable(div);
    loadTools(div);
    
    

    
    CSimage.stack['imageIds'].forEach(imageId => cornerstone.loadAndCacheImage(imageId));
    updateTheImage(CSimage, 0);
    movieButton.addEventListener('click', playMovie);
    showMetadata.addEventListener('click', showMetadataFn);
    deleteImage.addEventListener('click', deleteImageFn);
    element.removeEventListener('click', populateGrid);
}

function interpolate(e) {
    let element = e.target.parentElement.parentElement;
    let viewport = cornerstone.getViewport(element);
    viewport.pixelReplication = !viewport.pixelReplication;
    cornerstone.setViewport(element, viewport);
}

function playMovie(e) {
    let frame = e.target.parentElement.parentElement.id.slice(-1);
    let image = CSImage.instances(e.target.parentElement.parentElement);
    if (image.numImages === 1)
        return;
    else if (image.stack['currentImageIdIndex'] === image.numImages - 1)
        image.movieReverse = true;
    else if (image.stack['currentImageIdIndex'] === 0)
        image.movieReverse = false;

    var movieButton = e.target;
    var movieTimeout = undefined;

    if (image.movieReverse)
        movieHandlerReverse();
    else 
        var movie = setInterval(movieHandlerForward, 1000/24);
        
    function pauseMovie() {
        clearInterval(movie);
        clearTimeout(movieTimeout);
        movieButton.src =  './images/playButton.png';
        movieButton.removeEventListener('click', pauseMovie);
        movieButton.addEventListener('click', playMovie);
    }

    function movieHandlerForward() {
        image.stack['currentImageIdIndex'] += 1;
        updateTheImage(frame, stack[frame]['currentImageIdIndex']);
        
        if (image.stack['currentImageIdIndex'] === image.numImages - 1) {
            clearInterval(movie);
            image.movieReverse = true;
            movieTimeout = setTimeout(movieHandlerReverse, 1000);
        }
    }

    function movieHandlerReverse() {
        function Reverse() {
            image.stack['currentImageIdIndex'] -= 1;
            updateTheImage(frame, image.stack['currentImageIdIndex']);

            if (image.stack['currentImageIdIndex'] === 0) {
                image.movieReverse = false;
                pauseMovie();
            }
        }
        movie = setInterval(Reverse, 1000/24);
    }

    movieButton.addEventListener('click', pauseMovie);
    movieButton.removeEventListener('click', playMovie);
    movieButton.src =  './images/pauseButton.png';
}

function showMetadataFn(e) {
    let element = document.getElementById(e.target.parentElement.parentElement.classList[1]);
    let metadata = element.parentElement.getElementsByClassName('metadata')[0];

    metadata.style.display = 'inline-block';
    //element.parentElement.getElementsByClassName('border')[0].style.display = 'inline-block';
    //element.style.width = 'calc(50% - 0.125em)';
    //cornerstone.resize(element);
    element.style.display = 'none';
    
    function hideMetadataFn(e) {
        metadata.style.display = 'none';
        element.parentElement.getElementsByClassName('border')[0].style.display = 'none';
        //element.style.width = '100%';
        //cornerstone.resize(element);
        element.style.display = 'inline-block';
        e.target.addEventListener('click', showMetadataFn);
    }

    e.target.removeEventListener('click', showMetadataFn);
    e.target.addEventListener('click', hideMetadataFn);
    getFileMetadata(element);
}

function deleteImageFn(e) {
    let image = e.target.parentElement.parentElement;
    document.getElementById(image.classList[1]).remove();
    
    let elements = image.getElementsByClassName('delete'),
        ele;

    while (ele = elements[0]) {
        ele.parentElement.removeChild(ele);
    }
    image.getElementsByClassName('addImage')[0].style.display = 'inline-block';
    image.getElementsByClassName('addImage')[0].addEventListener('click', populateGrid);
}

function switchTool(newTool, mouseButton) {
    if (newTool in Object.values(mouseButtons)) {
        return;
    }

    cornerstoneTools.setToolEnabled(mouseButtons[mouseButton], {});
    cornerstoneTools.setToolActive(newTool, { mouseButtonMask : mouseButton } );
    mouseButtons[mouseButton] = newTool;
}

document.getElementById('toolbar').getElementsByClassName('mouseLeft').forEach(element => {
    element.addEventListener('click', function() {
        switchTool(element.parentElement.parentElement.id, 1);
    });
});

document.getElementById('toolbar').getElementsByClassName('mouseRight').forEach(element => {
    element.addEventListener('click', function() {
        switchTool(element.parentElement.parentElement.id, 2);
    });
});

createGrid(2, 2);

