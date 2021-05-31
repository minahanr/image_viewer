var elements = document.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', e => {
        let row = e.target.parentElement;
        row.classList.toggle('active-row');
        
        if (row.getElementsByTagName('input')[0].value === '0') {
            row.getElementsByTagName('input')[0].value = '1';
        } else {
            row.getElementsByTagName('input')[0].value = '0';
        }
    })
}