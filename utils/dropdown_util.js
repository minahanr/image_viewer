export default function dropdown_util(element) {
    element.parentElement.parentElement.getElementsByClassName('sub-title-name').forEach(e2 => {
        let classList = e2.getElementsByTagName('i')[0].classList;
        if (e2 === element) {
            e2.parentElement.getElementsByClassName('dropdown')[0].classList.toggle('visible');
            if (classList.contains('up')) {
                classList.remove('up');
                classList.add('down');
            } else {
                classList.add('up');
                classList.remove('down');
            }

        } else {
            e2.parentElement.getElementsByClassName('dropdown')[0].classList.remove('visible');
            classList.remove('up');
            classList.add('down');
        }
    });
}