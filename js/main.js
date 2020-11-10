/// <reference path = "main.d.ts" />   
var Stateobj = /** @class */ (function () {
    function Stateobj() {
    }
    Stateobj.prototype.mapTemplate = function (result) {
        var obj = { "India": result };
        var templateCard = $("#total-data").html();
        var text = Mustache.render(templateCard, obj);
        $("#map-card").html(text);
    };
    Stateobj.prototype.showTable = function (object) {
        var template = $("#template").html();
        var text = Mustache.render(template, object);
        $("#body").html(text);
    };
    Stateobj.prototype.getRatio = function (x, y) {
        return ((x * 100) / y).toFixed(1);
    };
    Stateobj.prototype.getData = function (value) {
        var activeRatio = this.getRatio(value.active, value.confirmed);
        var recoveryRatio = this.getRatio(value.recovered, value.confirmed);
        var caseFatality = this.getRatio(value.deaths, value.confirmed);
        return {
            stateName: value.state,
            stateCode: value.statecode,
            confirmed: value.confirmed,
            active: value.active,
            recovered: value.recovered,
            deceased: value.deaths,
            lastUpdate: new Date(value.lastupdatedtime).toDateString(),
            other: value.migratedother,
            notes: value.statenotes,
            deltaConfirmed: value.deltaconfirmed == 0 ? false : value.deltaconfirmed,
            deltaRecovered: value.deltarecovered == 0 ? false : value.deltarecovered,
            deltaDeceased: value.deltadeaths == 0 ? false : value.deltadeaths,
            activeRatio: activeRatio,
            recoveryRatio: recoveryRatio,
            caseFatality: caseFatality
        };
    };
    return Stateobj;
}());
var result = [];
var state = new Stateobj();
$.ajax({
    url: 'https://api.covid19india.org/data.json',
    complete: function (response) {
        var data = JSON.parse(response.responseText);
        var searchTags = [];
        var total = [];
        var object = {};
        for (var x in data) {
            if (x == "statewise") {
                $.each(data[x], function (key, value) {
                    if (value.statecode === "TT") {
                        searchTags.push("India");
                        total.push(state.getData(value));
                    }
                    else if (value.statecode === "LD" || value.statecode === "UN") {
                        return;
                    }
                    else {
                        searchTags.push(value.state);
                        result.push(state.getData(value));
                    }
                });
                searchTags.sort();
                object["result"] = result;
                object["India"] = total;
            }
        }
        $("#searchBar").autocomplete({
            source: searchTags
        });
        state.mapTemplate(object["India"]);
        state.showTable(object);
        $.each(result, function (key, value) {
            $('.select-state').append(new Option(value.stateName, value.stateCode));
        });
        $('.table-bordered thead th').on('click', function () {
            $(this).toggleClass("sort");
            var sortBy = $(this).html().toLowerCase();
            if ($(this).hasClass("sort")) {
                $(this).css("background", "rgb(0, 0, 0, 8%)");
                result.sort(sortByAssecOrder(sortBy));
            }
            else {
                $(this).css("background", "rgba(0, 0, 0, 0.05");
                result.sort(sortByDecsOrder(sortBy));
            }
            state.showTable(object);
        });
    },
    error: function () {
        $('#output').html('There was an error!');
    }
});
$("#searchBar").on("change", function () {
    var stateName = $("#searchBar").val();
    for (var i in result) {
        if (result[i].stateName === stateName) {
            state.mapTemplate(result[i]);
        }
    }
});
function sortByAssecOrder(property) {
    return function (a, b) {
        if (a[property] > b[property])
            return 1;
        else if (a[property] < b[property])
            return -1;
        return 0;
    };
}
function sortByDecsOrder(property) {
    return function (a, b) {
        if (b[property] > a[property])
            return 1;
        else if (b[property] < a[property])
            return -1;
        return 0;
    };
}
$('.Navbar').on('mouseenter', function () {
    $('.Navbar').toggleClass('nav-expand');
});
$('.Navbar').on('mouseleave', function () {
    $('.Navbar').removeClass('nav-expand');
});
$('.sort-table-left-ques').on('click', function () {
    $(".sort-table-ques").toggle();
});
$('.sort-table-right').on('click', function () {
    $('.body-middle').toggleClass("expand");
    $("i", this).toggleClass("fas fa-arrow-left fas fa-ellipsis-v");
    $(".table-hide").nextAll().toggle();
});
function isActive(e) {
    if ($('.map-card div').hasClass('active')) {
        var ele = $('.active');
        $(ele).removeClass('active');
    }
    $(e).addClass('active');
}
