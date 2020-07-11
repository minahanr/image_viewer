export default function updateImageSelector(imageIndex) {
    document.getElementById('imageSelector').innerHTML = 'image ' + (stack['currentImageIdIndex'] + 1) + '/' + num_images;
}