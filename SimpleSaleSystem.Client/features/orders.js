function createOrder() {
    var products = getOrderingProducts();

    for (var product of products) {
        processPost(
            '/orders',
            { productID: product.id, amount: product.amount },
            (data) => console.log(data),
            (_, text, error) => console.error(text, error)
        );
    }

    alert('Objednávka byla odeslána.');
    loadProducts();
}

function loadOrders() {
    var onSuccess = (data) => {
        var table = $("#orders-table tbody");
        table.empty();

        for (var item of data.sort((a, b) => b.id - a.id)) {
            var cells = [
                $("<td>").html(item.id),
                $("<td>").html(createProductName(item.product)),
                $("<td>").html(item.product.price),
                $("<td>").html(item.amount),
                $("<td>").html(item.product.price * item.amount),
                $("<td>").html(item.cancelledAt ? new Date(item.cancelledAt).toLocaleString() : ''),
                $("<td>").html(generateOrderInputField(item))
            ];

            table.append($("<tr>").html(cells));
        }
    };

    var onError = (xhttp) => {
        alert('Při načítání produktů došlo k chybě. Server vrátil ' + xhttp.statusText + ' - ' + xhttp.responseText);
    }

    processAjax('GET', '/orders', onSuccess, onError);
}

function generateOrderInputField(order) {
    var inputs = [];

    if (!order.cancelledAt) {
        var cancelButton = createButton('Stornovat', ['btn-danger'], order.id, () => cancelOrder(order.id));

        inputs.push($("<div>").addClass('col-auto').html(cancelButton));
    } else {
        return [];
    }

    return inputs;
}

function cancelOrder(orderID) {
    if (confirm('Opravdu si přejete stornovat tuto objednávku?')) {
        var onSuccess = (_) => {
            alert('Objednávka byla úspěšně stornována.');
            loadOrders();
        }

        processAjax('PUT', '/orders/' + orderID + '/cancel', onSuccess, (xhttp) => {
            alert('Při stornu objednávky došlo k chybě. Server vrátil ' + xhttp.statusText + ' - ' + xhttp.responseText)
        });
    }
}
