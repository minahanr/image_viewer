import { createContainer, createHorizontalBorder, createVerticalBorder } from './createContainer.js';
import Border from '../utils/Border.js';

export function splitImageHorizontal(element, numRows) {

    element.innerHTML = '';
    element.classList.remove('image-container');
    element.classList.add('image-container-parent');

    let containers = [];
    for (let i = 0; i < numRows; i++) {
        containers.push(createContainer(element, numRows, 1));

        if (i !== 0) {
            new Border(border, containers[i-1], containers[i]);
        }

        if (i !== numRows - 1) {
            var border = createHorizontalBorder();
            element.appendChild(border);
        }
    }
    return containers;
}

export function splitImageVertical(element, numCols) {
    element.innerHTML = '';
    element.classList.remove('image-container');

    let containers = [];
    for (let i = 0; i < numCols; i++) {
        containers.push(createContainer(element, 1, numCols));

        if (i !== 0) {
            new Border(border, containers[i-1], containers[i]);
        }

        if (i !== numCols - 1) {
            var border = createVerticalBorder();
            element.appendChild(border);
        }


    }

    return containers;
}