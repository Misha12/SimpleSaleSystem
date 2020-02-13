function loadProducts() {
    var onSuccess = (data) => {
        var table = $("#products-table tbody");
        table.empty();

        for (var item of data) {
            var cells = [
                $("<td>").html(item.id),
                $("<td>").html(item.name),
                $("<td>").html(item.volume),
                $("<td>").html(item.price),
                $("<td>").addClass(['form-row', 'mr-0']).html(generateProductInputField(item))
            ];

            table.append($("<tr>").html(cells));
        }

        calculatePrices();
    };

    var onError = (xhttp) => {
        alert('Při načítání produktů došlo k chybě. Server vrátil ' + xhttp.statusText + ' - ' + xhttp.responseText);
    };

    processAjax('GET', '/products', onSuccess, onError);
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
    } else {
        inputs.push(createButton("Aktivovat", ["btn-success"], item.id, () => toggleProduct(item.id)));
    }

    return inputs;
}

function toggleProduct(itemId) {
    var onSuccess = (_) => loadProducts();
    var onError = (xhttp) => alert('Při přepnutí prodejnosti produktu došlo k chybě. Server vrátil ' + xhttp.statusText + ' - ' + xhttp.responseText);

    processAjax('PUT', '/products/' + itemId + '/toggle', onSuccess, onError);
}

function getOrderingProducts() {
    var rows = $("#products-table tbody tr").toArray();
    var products = [];

    for (var row of rows) {
        var amount = parseInt(row.cells[4].childNodes[1].childNodes[0].value, 10);
        if (amount == 0) continue;

        var id = parseInt(row.cells[0].innerText);
        var price = parseInt(row.cells[3].innerText);

        products.push({ id, price, amount });
    }

    return products;
}

function calculatePrices() {
    var products = getOrderingProducts();
    $("#total_price").html(products.reduce((prev, act) => { return prev + (act.price * act.amount) }, 0));
}
