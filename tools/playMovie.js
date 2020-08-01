import CSImage from '../utils/CSImage.js';
import updateTheImage from '../utils/updateImageSelector.js';

export default function playMovie(e) {
    let CSimage = CSImage.instances().get(e.target.parentElement.parentElement);
    if (CSimage.lastIndex === 0)
        return;
    else if (CSimage.currentImageIdIndex === CSimage.lastIndex)
        CSimage.movieReverse = true;
    else if (CSimage.currentImageIdIndex === 0)
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
        updateTheImage(CSimage.element, CSimage.currentImageIdIndex + 1);
        
        if (CSimage.currentImageIdIndex === CSimage.lastIndex) {
            clearInterval(movie);
            CSimage.movieReverse = true;
            movieTimeout = setTimeout(movieHandlerReverse, 1000);
        }
    }

    function movieHandlerReverse() {
        function Reverse() {
            updateTheImage(CSimage.element, CSimage.currentImageIdIndex - 1);

            if (CSimage.currentImageIdIndex === 0) {
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