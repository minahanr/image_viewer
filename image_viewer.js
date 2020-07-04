cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

const element = document.getElementById('dicomImage');
cornerstone.enable(element);

let imageIds = [];
let currentImageIndex = 0;
let movieReverse = false;

const filePath = 'https://github.com/minahanr/image_viewer/blob/master/test_NeckHeadCT'

let num_images = 113;

max_str_len = Math.floor(Math.log10(num_images));
for (let i = 1; i <= num_images; i++) {
    let i_str_len = Math.floor(Math.log10(i));
    let i_str = '0'.repeat(max_str_len - i_str_len) + i

    imageIds.push('wadouri:' + filePath + '/' + 1 + '-' + i_str + '.dcm?raw=true')
}

function updateImageSelector(imageIndex) {
    document.getElementById('imageSelector').innerHTML = 'image ' + (currentImageIndex + 1) + '/' + imageIds.length ;
}

// show image #1 initially
function updateTheImage(imageIndex) {
    currentImageIndex = imageIndex;
    var element = document.getElementById('dicomImage');
    cornerstone.loadAndCacheImage(imageIds[currentImageIndex]).then(function(image) {
        let prev_viewport = cornerstone.getViewport(element);
        var new_viewport = cornerstone.getDefaultViewportForImage(element, image);

        if (prev_viewport !== undefined) {
            new_viewport.scale = prev_viewport.scale;
            new_viewport.translation = prev_viewport.translation;
        }

        cornerstone.displayImage(element, image, new_viewport);
    });
    updateImageSelector(imageIndex);
}

updateTheImage(0);

// Add event handlers to change images

const wheelEvents = ['mousewheel', 'DOMMouseScroll'];

wheelEvents.forEach((eventType) => {
  element.addEventListener(eventType, function (e) {
    // Firefox e.detail > 0 scroll back, < 0 scroll forward
    // chrome/safari e.wheelDelta < 0 scroll back, > 0 scroll forward
    if (e.wheelDelta < 0 || e.detail > 0) {
      if (currentImageIndex < imageIds.length - 1) {
        currentImageIndex += 1;
        updateTheImage(currentImageIndex);
      }
    } else {
      if (currentImageIndex > 0) {
        currentImageIndex -= 1;
        updateTheImage(currentImageIndex);
      }
    }

    // Prevent page fom scrolling
    return false;
  });
});

element.addEventListener('mousedown', function (e) {
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
})



function playMovie() {
    if (currentImageIndex === num_images - 1)
        movieReverse = true;

    movieButton = document.getElementById('playMovie');

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
        currentImageIndex += 1;
        updateTheImage(currentImageIndex);
        
        if (currentImageIndex === num_images - 1) {
            clearInterval(movie);
            movieReverse = true;
            setTimeout(movieHandlerReverse, 1000);
        }
    }

    function movieHandlerReverse() {
        function Reverse() {
            currentImageIndex -= 1;
            updateTheImage(currentImageIndex);

            if (currentImageIndex === 0) {
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

document.getElementById('playMovie').addEventListener('click', playMovie);