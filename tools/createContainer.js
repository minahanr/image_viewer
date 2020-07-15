import populateGrid from './populateGrid.js';

export function createHorizontalBorder() {
    let border = document.createElement('div');
    border.classList = 'horizontal-border';
    return(border);
}

export function createVerticalBorder() {
    let border = document.createElement('div');
    border.classList = 'vertical-border';
    return(border);
}

export function createContainer(parentElement, rows, cols) {
    let container = document.createElement('div');
    container.style.position = 'relative';
    container.style.cssFloat = 'left';
    container.classList = 'image-container';

    container.style.height = "calc((100% - " + (Math.min(rows, 3) - 1) + " * 0.25em) / " + Math.min(rows, 3) + ")";
    container.style.width = "calc((100% - " + (Math.min(cols, 3) - 1) + " * 0.25em) / " + Math.min(cols, 3) + ")";
        
    let addImage = document.createElement('div');
    addImage.innerHTML = 'add image';
    addImage.classList = 'addImage';
    container.appendChild(addImage);
    parentElement.appendChild(container);
    
    addImage.addEventListener('click', populateGrid);
    return container;
}