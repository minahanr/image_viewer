import dropdown_util from '../utils/dropdown_util.js';
import CSImage from '../utils/CSImage.js';
import populateGrid from './populateGrid.js';
import parseArray from '../utils/parseArray.js';
import updateTheImage from '../utils/updateImageSelector.js';
import highlightContainer from './highlightContainer.js';

document.getElementById('submit-filters').addEventListener('click', evt => {
    let http = new XMLHttpRequest();
    let URL = 'browser/add_images.php';
    let params = "name=" + document.getElementById('name').value + '&modality=' + document.getElementById('modality').value + '&subject=' + document.getElementById('subject').value;
    http.open("GET", URL+'?'+params, true);
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('database-image-results').innerHTML = http.responseText;

            var rows = document.getElementById('database-image-results').firstChild.children[1].children;
            rows.forEach(row => {
                console.log(row);
                row.addEventListener('click', evt => {
                    let target = evt.target.parentElement;
                    let newImage = {
                        series_id: target.children[3].innerHTML,
                        baseURL: target.children[5].innerHTML,
                        format: target.children[4].innerHTML,
                        numFrames: target.children[6].innerHTML,
                        imgsPerFrame: target.children[7].innerHTML,
                        name: target.children[0].innerHTML,
                        modality: target.children[1].innerHTML,
                        subject: target.children[2].innerHTML
                    }
                    imageSeries.push(newImage);

                    if (!(newImage.series_id in imageSeriesDict)) {
                        imageSeriesDict[newImage.series_id] = imageSeries.length - 1;
                    }

                    if (CSImage.highlightedContainer === undefined) {
                        console.log('t1');
                        return;
                    } else if (CSImage.highlightedElement() == '') {
                        console.log('t2');
                        populateGrid(CSImage.highlightedContainer(), imageSeriesDict[newImage.series_id], { name: newImage.name, sliceThickness: newImage.slice_thickness });
                    } else {
                        console.log('t3');
                        let CSimage = CSImage.instances().get(CSImage.highlightedElement());
                        let { urlsOverTime, format } = parseArray(imageSeriesDict[newImage.series_id]);
                        CSimage.addLayer(format, urlsOverTime, imageSeries[imageSeriesDict[newImage.series_id]].baseURL, { name: newImage.name, sliceThickness: newImage.slice_thickness });
                        updateTheImage(CSImage.highlightedElement(), CSImage.instances().get(CSImage.highlightedElement()).currentImageIdIndex);
                        highlightContainer(CSimage.element);
                    }
                });
            })
        }

        
    }
    http.send();

    let newSeries = imageSeries.filter(image => {
        return image.name.toUpperCase().includes(document.getElementById('name').value.toUpperCase()) &&
        image.modality.toUpperCase().includes(document.getElementById('modality').value.toUpperCase()) &&
        image.subject.toUpperCase().includes(document.getElementById('subject').value.toUpperCase());
    });

    const results = document.getElementById('selected-image-results');
    if (results.getElementsByTagName('table').length !== 0) {
        results.removeChild(results.getElementsByTagName('table')[0]);
    }

    var selectedImagesTable = document.createElement('table');
    let selectedImagesTR = document.createElement('tr');

    selectedImagesTR.appendChild(document.createElement('th'));
    selectedImagesTR.appendChild(document.createElement('th'));
    selectedImagesTR.appendChild(document.createElement('th'));

    selectedImagesTR.cells[0].appendChild(document.createTextNode('Name'));
    selectedImagesTR.cells[1].appendChild(document.createTextNode('Modality'));
    selectedImagesTR.cells[2].appendChild(document.createTextNode('Subject'));

    selectedImagesTable.appendChild(selectedImagesTR);

    for(let i = 0; i < Math.min(newSeries.length, 100); i++) {
        let image = newSeries[i];
        selectedImagesTR = document.createElement('tr');

        selectedImagesTR.appendChild(document.createElement('th'));
        selectedImagesTR.appendChild(document.createElement('th'));
        selectedImagesTR.appendChild(document.createElement('th'));

        selectedImagesTR.cells[0].appendChild(document.createTextNode(image.name));
        selectedImagesTR.cells[1].appendChild(document.createTextNode(image.modality));
        selectedImagesTR.cells[2].appendChild(document.createTextNode(image.subject));

        selectedImagesTable.appendChild(selectedImagesTR);

        
        selectedImagesTR.addEventListener('click', evt => {
            if (CSImage.highlightedContainer() === undefined) {
                return;
            } else if (CSImage.highlightedElement() === '') {
                populateGrid(CSImage.highlightedContainer(), imageSeriesDict[image.series_id], { name: image.name, sliceThickness: image.slice_thickness });
            } else {
                let CSimage = CSImage.instances().get(CSImage.highlightedElement());
                let { urlsOverTime, format } = parseArray(imageSeriesDict[image.series_id]);
                CSimage.addLayer(format, urlsOverTime, imageSeries[imageSeriesDict[image.series_id]].baseURL, { name: image.name, sliceThickness: image.slice_thickness });
                updateTheImage(CSImage.highlightedElement(), CSImage.instances().get(CSImage.highlightedElement()).currentImageIdIndex);
                highlightContainer(CSimage.element);
            }
        });
    }

    results.appendChild(selectedImagesTable);
    // dropdown_util(document.getElementById('image-results').parentElement.parentElement.getElementsByClassName('sub-title-name')[0]);
});