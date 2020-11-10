var Chart = /** @class */ (function () {
    function Chart() {
    }
    Chart.prototype.chartTemplate = function (chart, dataPoint, title, chartContainer) {
        var id = "#" + chart;
        chart = new CanvasJS.Chart(chartContainer, {
            backgroundColor: "rgba(255, 7, 58, 0.125)",
            title: {
                text: title,
                horizontalAlign: "left",
                fontColor: "red",
                fontSize: 20,
                fontFamily: "archia"
            },
            toolTip: {
                enabled: false
            },
            axisX: {
                lineThickness: 2,
                lineColor: "#ff073a",
                labelFontColor: "red",
                tickColor: "red",
                labelFormatter: function (e) {
                    return CanvasJS.formatDate(e.value, "DD MMM");
                }
            },
            axisY2: {
                minimum: 0,
                gridThickness: 0,
                lineThickness: 2,
                lineColor: "red",
                labelFontColor: "red",
                tickColor: "red",
                valueFormatString: ""
            },
            data: [{
                    color: "red",
                    type: "line",
                    dataPoints: dataPoint,
                    mouseover: function onMouseover(e) {
                        var text = $("<div><span> Date </span><br><span> " + e.dataPoint.y + " </span></div>");
                        $(id).html(text);
                    },
                    connectNullData: true,
                    axisYType: "secondary"
                }]
        });
        chart.render();
    };
    Chart.prototype.getDataPoints = function (x, y) {
        return { x: x, y: y };
    };
    return Chart;
}());
$(function () {
    showChart($(".select-state option:selected").val());
});
$(".select-state").on("change", function () {
    showChart($(".select-state option:selected").val());
});
function showChart(state) {
    var dataPoint1 = [], dataPoint2 = [], dataPoint3 = [], dataPoint4 = [];
    $.getJSON("https://api.covid19india.org/v4/min/timeseries.min.json", function (data) {
        var chart = new Chart();
        $.each(data, function (key, val) {
            if (key === state) {
                $.each(val.dates, function (key, val) {
                    if (new Date(key) < new Date(2020, 11, 9) && new Date(key) > new Date(2020, 09, 10)) {
                        if (val.total.confirmed) {
                            dataPoint1.push(chart.getDataPoints(new Date(key), val.total.confirmed));
                            dataPoint2.push(chart.getDataPoints(new Date(key), val.total.recovered));
                            dataPoint4.push(chart.getDataPoints(new Date(key), val.total.tested));
                            if (val.total.deceased) {
                                dataPoint3.push(chart.getDataPoints(new Date(key), val.total.deceased));
                            }
                        }
                    }
                });
                chart.chartTemplate("chart1", dataPoint1, "Confirmed", "chartContainer1");
                chart.chartTemplate("chart2", dataPoint2, "Recovered", "chartContainer2");
                chart.chartTemplate("chart3", dataPoint3, "Deceased", "chartContainer3");
                chart.chartTemplate("chart4", dataPoint4, "Tested", "chartContainer4");
            }
        });
    });
}
