import CSImage from '../utils/CSImage.js';
import updateTheImage from '../utils/updateImageSelector.js';

export default function playMovie(e) {
    let CSimage = CSImage.instances.get(e.target.parentElement.parentElement);
    if (CSimage.numImages === 1)
        return;
    else if (CSimage.stack['currentImageIdIndex'] === CSimage.numImages - 1)
        CSimage.movieReverse = true;
    else if (CSimage.stack['currentImageIdIndex'] === 0)
        CSimage.movieReverse = false;

    var movieButton = e.target;
    var movieTimeout = undefined;

    if (CSimage.movieReverse)
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
        CSimage.stack['currentImageIdIndex'] += 1;
        updateTheImage(CSimage.element, CSimage.stack['currentImageIdIndex']);
        
        if (CSimage.stack['currentImageIdIndex'] === CSimage.numImages - 1) {
            clearInterval(movie);
            CSimage.movieReverse = true;
            movieTimeout = setTimeout(movieHandlerReverse, 1000);
        }
    }

    function movieHandlerReverse() {
        function Reverse() {
            CSimage.stack['currentImageIdIndex'] -= 1;
            updateTheImage(CSimage.element, CSimage.stack['currentImageIdIndex']);

            if (CSimage.stack['currentImageIdIndex'] === 0) {
                CSimage.movieReverse = false;
                pauseMovie();
            }
        }
        movie = setInterval(Reverse, 1000/24);
    }

    movieButton.addEventListener('click', pauseMovie);
    movieButton.removeEventListener('click', playMovie);
    movieButton.src =  './images/pauseButton.png';
}