import dropdown_util from '../utils/dropdown_util.js';
import CSImage from '../utils/CSImage.js';
import populateGrid from './populateGrid.js';
import parseArray from '../utils/parseArray.js';
import updateTheImage from '../utils/updateImageSelector.js';
import highlightContainer from './highlightContainer.js';

document.getElementById('submit-filters').addEventListener('click', evt => {
    let newSeries = imageSeries.filter(image => {
        return image.name.toUpperCase().includes(document.getElementById('name').value.toUpperCase()) &&
        image.modality.toUpperCase().includes(document.getElementById('modality').value.toUpperCase()) &&
        image.subject.toUpperCase().includes(document.getElementById('subject').value.toUpperCase());
    });

    const results = document.getElementById('image-results');
    if (results.getElementsByTagName('table').length !== 0) {
        results.removeChild(results.getElementsByTagName('table')[0]);
    }

    var table = document.createElement('table');
    let tr = document.createElement('tr');

    tr.appendChild(document.createElement('th'));
    tr.appendChild(document.createElement('th'));
    tr.appendChild(document.createElement('th'));

    tr.cells[0].appendChild(document.createTextNode('Name'));
    tr.cells[1].appendChild(document.createTextNode('Modality'));
    tr.cells[2].appendChild(document.createTextNode('Subject'));

    table.appendChild(tr);

    for(let i = 0; i < Math.min(newSeries.length, 100); i++) {
        let image = newSeries[i];
        tr = document.createElement('tr');

        tr.appendChild(document.createElement('th'));
        tr.appendChild(document.createElement('th'));
        tr.appendChild(document.createElement('th'));

        tr.cells[0].appendChild(document.createTextNode(image.name));
        tr.cells[1].appendChild(document.createTextNode(image.modality));
        tr.cells[2].appendChild(document.createTextNode(image.subject));

        table.appendChild(tr);

        
        tr.addEventListener('click', evt => {
            if (CSImage.highlightedContainer() === undefined) {
                return;
            } else if (CSImage.highlightedElement() === '') {
                populateGrid(CSImage.highlightedContainer(), imageSeriesDict[image.series_id], { name: image.name, sliceThickness: image.slice_thickness });
            } else {
                let CSimage = CSImage.instances().get(CSImage.highlightedElement());
                let { urlsOverTime, format } = parseArray(imageSeriesDict[image.series_id]);
                CSimage.addLayer(format, urlsOverTime, { name: image.name, sliceThickness: image.slice_thickness });
                updateTheImage(CSImage.highlightedElement(), CSImage.instances().get(CSImage.highlightedElement()).currentImageIdIndex);
                highlightContainer(CSimage.element);
            }
        });
    }

    results.appendChild(table);
    dropdown_util(document.getElementById('image-results').parentElement.parentElement.getElementsByClassName('sub-title-name')[0]);
});