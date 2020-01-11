function loadReport() {
    var onSuccess = (data) => {
        var report = [];

        for (var order of data) {
            var exists = report.some(o => o.productID == order.product.id);

            if (exists) {
                var reportItem = report.find(o => o.productID == order.product.id);

                reportItem.count += order.amount;
                reportItem.totalPrice += order.amount * order.product.price;
                reportItem.totalPriceWithoutCancellation += order.cancelledAt ? 0 : order.amount * order.product.price;
                reportItem.nonCancelledAmount += !order.cancelledAt ? order.amount : 0;
            } else {
                report.push({
                    productID: order.product.id,
                    name: createProductName(order.product, true),
                    count: order.amount,
                    totalPrice: order.amount * order.product.price,
                    totalPriceWithoutCancellation: order.cancelledAt ? 0 : order.amount * order.product.price,
                    nonCancelledAmount: !order.cancelledAt ? order.amount : 0
                });
            }
        }

        var table = $("#report-table tbody");
        table.empty();

        for (var reportItem of report.sort((a, b) => b.totalPriceWithoutCancellation - a.totalPriceWithoutCancellation)) {
            var cells = [
                $("<td>").html(reportItem.name),
                $("<td>").html(reportItem.count),
                $("<td>").html(reportItem.nonCancelledAmount),
                $("<td>").html(reportItem.totalPrice),
                $("<td>").html(reportItem.totalPriceWithoutCancellation)
            ];

            table.append($("<tr>").html(cells));
        }

        var sum = $("#report-table tfoot tr");

        var getCell = (val) => $("<th>").addClass(['border-top', 'border-dark']).html(val);

        sum.html([
            getCell("Celkem: "),
            getCell(report.reduce((prev, act) => prev + act.count, 0)),
            getCell(report.reduce((prev, act) => prev + act.nonCancelledAmount, 0)),
            getCell(report.reduce((prev, act) => prev + act.totalPrice, 0)),
            getCell(report.reduce((prev, act) => prev + act.totalPriceWithoutCancellation, 0))
        ]);
    };

    var onError = (xhttp) => {
        alert('Při načítání objednávek došlo k chybě. Server vrátil ' + xhttp.statusText + ' - ' + xhttp.responseText);
    }

    processAjax('GET', '/orders', onSuccess, onError);
}
