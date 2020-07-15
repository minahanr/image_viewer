import getFileMetadata from './getFileMetadata.js';

export default function showMetadataFn(e) {
    let element = e.target.parentElement.parentElement.getElementsByClassName('image')[0];
    let metadata = element.parentElement.getElementsByClassName('metadata')[0];

    metadata.style.display = 'inline-block';
    //element.parentElement.getElementsByClassName('border')[0].style.display = 'inline-block';
    //element.style.width = 'calc(50% - 0.125em)';
    //cornerstone.resize(element);
    element.style.display = 'none';
    
    function hideMetadataFn(e) {
        metadata.style.display = 'none';
        //element.style.width = '100%';
        //cornerstone.resize(element);
        element.style.display = 'inline-block';
        e.target.addEventListener('click', showMetadataFn);
        e.target.removeEventListener('click', hideMetadataFn);
    }

    e.target.removeEventListener('click', showMetadataFn);
    e.target.addEventListener('click', hideMetadataFn);
    getFileMetadata(element);
}