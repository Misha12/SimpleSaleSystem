function setActive(id, callback) {
    document.getElementById(config.active).classList.remove('active');
    document.getElementById(id).classList.add('active');

    document.getElementById('section-' + config.active).classList.add('d-none');
    document.getElementById('section-' + id).classList.remove('d-none');

    for (var element of document.getElementsByClassName('only-' + config.active)) {
        element.classList.remove('d-flex');
        element.classList.add('d-none');
    }

    for (var element of document.getElementsByClassName('only-' + id)) {
        element.classList.remove('d-flex');
        element.classList.add('d-flex');
    }

    config.active = id;
    if (callback) {
        callback();
    }
}

function refresh() {
    loadProducts();
    calculatePrices();
}