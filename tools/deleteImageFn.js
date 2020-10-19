export default function deleteImageFn(e) {
    let image = e.target.parentElement.parentElement;
    
    let elements = image.getElementsByClassName('delete'),
        ele;

    while (ele = elements[0]) {
        ele.parentElement.removeChild(ele);
    }
}