function processAjax(method, endpoint, onSuccess, onError) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = (_) => {
        if (xhttp.readyState == xhttp.DONE) {
            if (xhttp.status == 200) {
                var json = JSON.parse(xhttp.responseText);
                onSuccess(json);
            } else {
                onError(xhttp);
            }
        }
    }

    xhttp.open(method, config.api.url + endpoint, true);

    if (config.api.basicAuth) {
        var authInfo = config.api.basicAuth.username + ':' + config.api.basicAuth.password;
        xhttp.setRequestHeader('Authorization', btoa(authInfo));
    }

    xhttp.send();
}

function processPost(endpoint, data, onSuccess, onError) {
    var request = $.ajax({
        url: config.api.url + endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data)
    });

    request.done(result => onSuccess(result))
    request.fail((xhr, textStatus, error) => onError(xhr, textStatus, error));
}

function createProductName(product, withID) { return (withID ? product.id + ': ' : '') + product.name + ' (' + product.volume + ')' };

function createButton(text, classList, id, onClick) {
    var button = $("<button>");
    classList.push("btn");
    id = `canSellChange_${id}`;

    button
        .attr('id', id)
        .addClass(classList)
        .html(text)
        .on('click', onClick);

    return button;
}
