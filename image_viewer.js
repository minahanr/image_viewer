import parseTiff from './parsers/tiffParser/parseTiff.js';
import ScrollWheelUpdaterTool from './tools/ScrollWheelUpdater.js';
import updateImageSelector from './utils/updateImageSelector.js';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;

const element = document.getElementById('image');
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.init({
    mouseEnabled: true,
    showSVGcursors: false
});
cornerstone.enable(element);





cornerstoneTools.register('tool', 'ScrollWheelUpdater', ScrollWheelUpdaterTool);
const ScrollWheel = ScrollWheelUpdaterTool;
cornerstoneTools.addTool(ScrollWheel);
cornerstoneTools.setToolActive('ScrollWheelUpdater', {});
const BrushTool = cornerstoneTools.addTool(cornerstoneTools['BrushTool']);

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
// show image #1 initially
function updateTheImage(imageIndex) {
    stack['currentImageIdIndex'] = imageIndex;
    var element = document.getElementById('image');
    cornerstone.loadAndCacheImage(stack['imageIds'][stack['currentImageIdIndex']]).then(function(image) {
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack)
        let prev_viewport = cornerstone.getViewport(element);
        var new_viewport = cornerstone.getDefaultViewportForImage(element, image);

        if (prev_viewport !== undefined) {
            new_viewport.scale = prev_viewport.scale;
            new_viewport.translation = prev_viewport.translation;
        }

        cornerstone.displayImage(element, image, new_viewport);
    });
    updateImageSelector(imageIndex, stack, num_images);
}

updateTheImage(0);

// Add event handlers to change images

function mouseWheel_handler(e) {
    // Firefox e.detail > 0 scroll back, < 0 scroll forward
    // chrome/safari e.wheelDelta < 0 scroll back, > 0 scroll forward
    if (e.wheelDelta < 0 || e.detail > 0) {
      if (stack['currentImageIdIndex'] < stack['imageIds'].length - 1) {
        stack['currentImageIdIndex'] += 1;
        updateTheImage(stack['currentImageIdIndex']);
      }
    } else {
      if (stack['currentImageIdIndex'] > 0) {
        stack['currentImageIdIndex'] -= 1;
        updateTheImage(stack['currentImageIdIndex']);
      }
    }

    // Prevent page fom scrolling
    return false;
}

function mousedown_handler(e) {
    if (e.button === 0) {
        let X = e.pageX;
        let Y = e.pageY;

        function mouseMoveHandler(e) {
            const deltaX = e.pageX - X;
            const deltaY = e.pageY - Y;
            X = e.pageX;
            Y = e.pageY;

            const viewport = cornerstone.getViewport(element);
            viewport.translation.x += (deltaX / viewport.scale);
            viewport.translation.y += (deltaY / viewport.scale);
            cornerstone.setViewport(element, viewport);
        }

        function mouseUpHandler(e) {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }
    else if (e.button === 2) {
        let Y = e.pageY

        function mouseMoveHandler(e) {
            const deltaY = e.pageY - Y;
            Y = e.pageY;
    
            const viewport = cornerstone.getViewport(element);
            viewport.scale += 0.005 * deltaY;
            cornerstone.setViewport(element, viewport);
        }
    
        function mouseUpHandler(e) {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }
    
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }
}



function playMovie() {
    if (num_images === 1)
        return;
    else if (stack['currentImageIdIndex'] === num_images - 1)
        movieReverse = true;
    else if (stack['currentImageIdIndex'] === 0)
        movieReverse = false;

    var movieButton = document.getElementById('playMovie');

    if (movieReverse)
        movieHandlerReverse();
    else 
        var movie = setInterval(movieHandlerForward, 1000/24);
    
    function pauseMovie() {
        clearInterval(movie);
        movieButton.innerHTML = 'Play Movie';
        movieButton.removeEventListener('click', pauseMovie);
        movieButton.addEventListener('click', playMovie);
    }

    function movieHandlerForward() {
        stack['currentImageIdIndex'] += 1;
        updateTheImage(stack['currentImageIdIndex']);
        
        if (stack['currentImageIdIndex'] === num_images - 1) {
            clearInterval(movie);
            movieReverse = true;
            setTimeout(movieHandlerReverse, 1000);
        }
    }

    function movieHandlerReverse() {
        function Reverse() {
            stack['currentImageIdIndex'] -= 1;
            updateTheImage(stack['currentImageIdIndex']);

            if (stack['currentImageIdIndex'] === 0) {
                movieReverse = false;
                pauseMovie();
            }
        }
        movie = setInterval(Reverse, 1000/24);
    }

    movieButton.addEventListener('click', pauseMovie);
    movieButton.removeEventListener('click', playMovie);
    movieButton.innerHTML = 'Pause Movie';
}

function segment() {
    cornerstoneTools.setToolActive('Brush', { mouseButtonMask : 1} );
    var segmentButton = document.getElementById('segment');

    segmentButton.innerHTML = 'Stop Segmentation';

    function stop_segment_handler() {
        cornerstoneTools.setToolEnabled('Brush', { mouseButtonMask : 1} );
        localStorage.setItem("debug", "cornerstoneTools");
        element.addEventListener('mousedown', mousedown_handler);
        segmentButton.addEventListener('click', segment);
        segmentButton.removeEventListener('click', stop_segment_handler)
        segmentButton.innerHTML = 'Start Segmentation';
    }

    element.removeEventListener('mousedown', mousedown_handler);
    segmentButton.removeEventListener('click', segment);
    segmentButton.addEventListener('click', stop_segment_handler);
}

element.addEventListener('mousedown', mousedown_handler);
document.getElementById('playMovie').addEventListener('click', playMovie);
document.getElementById('segment').addEventListener('click', segment);

const wheelEvents = ['mousewheel', 'DOMMouseScroll'];

for (event in wheelEvents) {
    element.addEventListener(event, mouseWheel_handler);
}
