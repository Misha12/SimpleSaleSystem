var active = 'products';
var apiUrl = 'https://apps.misha12.eu/simpleSellSystem_api';

function setActive(id, callback) {
    document.getElementById(active).classList.remove('active');
    document.getElementById(id).classList.add('active');

    document.getElementById('section-' + active).classList.add('d-none');
    document.getElementById('section-' + id).classList.remove('d-none');

    active = id;
    if (callback) {
        callback();
    }
}

function loadProducts() {
    var xhttp = new XMLHttpRequest();
    var table = $("#products-table tbody");
    table.empty();

    xhttp.onreadystatechange = (_) => {
        if (xhttp.readyState == xhttp.DONE) {
            if (xhttp.status == 200) {
                var json = JSON.parse(xhttp.responseText);

                for (var item of json) {
                    var cells = [
                        $("<td>").html(item.id),
                        $("<td>").html(item.name),
                        $("<td>").html(item.volume),
                        $("<td>").html(item.price),
                        $("<td>").addClass(['form-row', 'mr-0']).html(generateProductInputField(item))
                    ];

                    table.append($("<tr>").html(cells));
                }
            } else {
                alert('Při načítání produktů došlo k chybě. Server vrátil ' + xhttp.statusText + ' - ' + xhttp.responseText);
            }
        }
    }

    xhttp.open('GET', apiUrl + '/products', true);
    xhttp.send();
}

function generateProductInputField(item) {
    var inputs = [];

    if (item.canSell) {
        inputs.push($("<div>").addClass('col-auto')
            .html(createButton("Deaktivovat", ["btn-danger"], item.id, () => toggleProduct(item.id))));

        var textField = $("<input>")
            .attr("type", "number")
            .addClass(['form-control'])
            .attr('placeholder', 'Množství')
            .attr('id', `amount_${item.id}`)
            .attr('oninput', 'calculatePrices()')
            .val(0)
            .attr('min', 0);

        var plusButton = createButton('+', ['btn-success'], 'amount_plus_' + item.id, () => {
            var val = parseInt($(`#amount_${item.id}`).val(), 10);
            $(`#amount_${item.id}`).val(val + 1);
            calculatePrices();
        });

        var minusButton = createButton('-', ['btn-danger'], 'amount_minus_' + item.id, () => {
            var val = parseInt($(`#amount_${item.id}`).val(), 10);
            if (val - 1 >= 0) {
                $(`#amount_${item.id}`).val(val - 1);
                calculatePrices();
            }
        });

        inputs.push($("<div>").addClass('col-auto').html(textField));
        inputs.push($("<div>").addClass('col-auto').html(plusButton));
        inputs.push($("<div>").addClass('col-auto').html(minusButton));

        var buttonPay = createButton('Zaplatit', ['bg-primary', 'text-white'], `pay_${item.id}`, () => createOrder(item.id));
        inputs.push($("<div>").addClass('col-auto').html(buttonPay));
    } else {
        inputs.push(createButton("Aktivovat", ["btn-success"], item.id, () => toggleProduct(item.id)));
    }

    return inputs;
}

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

function toggleProduct(itemId) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = (_) => {
        if (xhttp.readyState == xhttp.DONE) {
            if (xhttp.status == 200) {
                loadProducts();
            } else {
                alert('Při přepnutí prodejnosti produktu došlo k chybě. Server vrátil ' + xhttp.statusText + ' - ' + xhttp.responseText);
            }
        }
    }

    xhttp.open('PUT', apiUrl + '/products/' + itemId + '/toggle', true);
    xhttp.send();
}

function createOrder(itemId) {
    var amount = parseInt($("#amount_" + itemId).val(), 10);

    $.ajax({
        url: apiUrl + '/orders',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ productID: itemId, amount })
    }).done((msg) => {
        alert('Objednávka byla úspěšně provedena.')
        loadProducts();
        calculatePrices();
    });
}

function loadOrders() {
    console.log('loadOrders');
}

function calculatePrices() {
    var rows = $("#products-table tbody tr").toArray();
    var totalPrice = 0;
    
    for(var row of rows) {
        var price = parseInt(row.cells[3].innerText);
        var amount = parseInt(row.cells[4].childNodes[1].childNodes[0].value, 10);

        totalPrice += price * amount;
    }

    $("#total_price").html(totalPrice);
}
