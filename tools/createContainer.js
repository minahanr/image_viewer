import { splitImageVertical, splitImageHorizontal } from './modifyImageWindows.js';
import CSImage from '../utils/CSImage.js';

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

export function createContainer(parentElement, rows, cols, addChildren) {
    let container = document.createElement('div');
    container.style.position = 'relative';
    container.style.cssFloat = 'left';
    container.classList = 'image-container';

    container.style.height = "calc((100% - " + (Math.min(rows, 3) - 1) + " * 5px) / " + Math.min(rows, 3) + ")";
    container.style.width = "calc((100% - " + (Math.min(cols, 3) - 1) + " * 5px) / " + Math.min(cols, 3) + ")";
    
    let childArr = parentElement.children;
    if (!addChildren && childArr.length) {
        while (childArr[0]) {
            container.appendChild(childArr[0]);
        }
        parentElement.appendChild(container);

        container.children.forEach(child => {
            if (child.classList.contains('image')) {
                cornerstone.resize(child);
            }
        });
    } else {
        parentElement.appendChild(container);
        // let addImage = document.createElement('div');
        // addImage.innerHTML = 'add image';
        // addImage.classList = 'addImage';
        // container.appendChild(addImage);
        
        let botLeft = document.createElement('div');
        botLeft.classList = 'overlay botLeft';
        
        let horizontal = document.createElement('img');
        horizontal.src = './images/horizontalSplit.png';
        horizontal.classList = 'imageOverlay item button';
        let vertical = document.createElement('img');
        vertical.src = './images/verticalSplit.png';
        vertical.classList = 'imageOverlay item button';

        container.appendChild(botLeft);
        botLeft.appendChild(horizontal);
        botLeft.appendChild(vertical);

        container.addEventListener('click', evt => {
            if (evt.target.classList.contains('image-container')) {
                CSImage.highlightedContainer(evt.target);
                CSImage.highlightedElement('');
            }
            
        });

        horizontal.addEventListener('click', function(e) {
            splitImageHorizontal(e.target.parentElement.parentElement, 2);
        });

        vertical.addEventListener('click', function(e) {
            splitImageVertical(e.target.parentElement.parentElement, 2);
        });
    }
    

    return container;
}