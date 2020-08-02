
function resize(element, sizeX, sizeY) {
    element.style.width = (sizeX * 100 / element.parentElement.getBoundingClientRect().width) + '%';
    element.style.height = (sizeY * 100 / element.parentElement.getBoundingClientRect().height) + '%';

    let images = element.getElementsByClassName('image');
    if (images !== undefined) {
        images.forEach(image => { cornerstone.resize(image); });
    }
}

function merge(border, largerContainer, smallerContainer, mergeMethod) {
    if (mergeMethod === 'vertical') {
        let newWidth = border.previousSibling.getBoundingClientRect().width + border.getBoundingClientRect().width + border.nextSibling.getBoundingClientRect().width;
        resize(largerContainer, newWidth, largerContainer.getBoundingClientRect().height);
    } else {
        let newHeight = border.previousSibling.getBoundingClientRect().height + border.getBoundingClientRect().height + border.nextSibling.getBoundingClientRect().height;
        resize(largerContainer, largerContainer.getBoundingClientRect().width, newHeight);
    }

    Border.instances().delete(border);
    border.remove();
    smallerContainer.remove();
}

function instances() {
    if (instances.map === undefined) {
        instances.map = new WeakMap();
    }

    return instances.map;
}

function resizeContainer(e) {
    let border = e.target;
    let containerUp = border.previousSibling;
    let containerDown = border.nextSibling;

    let initWidthUp = containerUp.getBoundingClientRect().width;
    let initHeightUp = containerUp.getBoundingClientRect().height;
    let initWidthDown = containerDown.getBoundingClientRect().width;
    let initHeightDown = containerDown.getBoundingClientRect().height;

    if (border.classList.contains('vertical-border')) {     

        function mouseUpHandler() {
            document.removeEventListener('mousemove', dragX);
            border.removeEventListener('mouseup', mouseUpHandler);
        }

        const startX = e.clientX;

        function dragX(e) {
            let newWidthUp = initWidthUp + e.clientX - startX;
            let newWidthDown = initWidthDown - (e.clientX - startX);

            if (newWidthUp <= 0) {
                merge(border, containerDown, containerUp, 'vertical');
                mouseUpHandler();
            } else if (newWidthDown <= 0) {
                merge(border, containerUp, containerDown, 'vertical')
                mouseUpHandler();
            } else {
                resize(containerUp, newWidthUp, initHeightUp);
                resize(containerDown, newWidthDown, initHeightDown);
            }
        }

        document.addEventListener('mousemove', dragX);
        border.addEventListener('mouseup', mouseUpHandler);
    } else if (border.classList.contains('horizontal-border')) {
        
        function mouseUpHandler(e) {
            document.removeEventListener('mousemove', dragY);
            border.removeEventListener('mouseup', mouseUpHandler);
        }

        const startY = e.clientY;

        function dragY(e) {
            let newHeightUp = initHeightUp + (e.clientY - startY);
            let newHeightDown = initHeightDown - (e.clientY - startY);

            if (newHeightUp <= 0) {
                merge(border, containerDown, containerUp, 'horizontal');
                mouseUpHandler();
            } else if (newHeightDown <= 0) {
                merge(border, containerUp, containerDown, 'horizontal');
                mouseUpHandler();
            } else {
            resize(containerUp, initWidthUp, newHeightUp);
            resize(containerDown, initWidthDown, newHeightDown);
            }
        }

        

        document.addEventListener('mousemove', dragY); 
        border.addEventListener('mouseup', mouseUpHandler);       
    } else {
        throw 'element is of neight class \'vertical-border\' nor \'horizontal-border\'';
    }
}

class Border {
    //if border is a vertical border, up = left, down = right
    constructor(border, up, down) {
        this.border = border;
        this.up = up;
        this.down = down;
        this.border.addEventListener('mousedown', resizeContainer);
        instances().set(border, this);    
    }
}

const obj = {
    Border,
    instances
};

export default obj;