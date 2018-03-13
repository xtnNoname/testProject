var viewedProbe;
//New data array
var chartData = [];

var room;

$(document).ready(function() {
    //sockets ======================================================================

    var socket = io('http://localhost:3000/thing/home');
    socket.on('connect', function() {
        console.log("connect");

    });
    socket.on('data', function(data) {
        console.log("data");
        setDataSet(data);
    });
    socket.on('join', function(data) {
        console.log("joined", data.obj);
    });

    socket.on('disconnect', function() {});


    if (viewedProbe = $("#userProbes:first-child:first-child").find(".panel-heading").attr("id")) {

        $('#' + viewedProbe).addClass('mod-clicked-fade');
        room = viewedProbe;
        console.log(room);
        socket.emit('room', room);
    }
    $("#userProbes:first-child:first-child").on('click', '.panel-heading', function() {
        console.log(viewedProbe + this.id + 'clicked');
        $('#' + viewedProbe).removeClass('mod-clicked-fade');
        viewedProbe = this.id;
        room = viewedProbe;
        socket.emit('room', room);
        console.log('viewedprobe:' + viewedProbe + '/');
        $('#' + viewedProbe).addClass('mod-clicked-fade');
        //$('#BStable').bootstrapTable('refresh', {url: 'custom/php/probesBSTable.php?id='+viewedProbe.charAt(5)});
    });









    var chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",

        "dataProvider": [],

        "categoryField": "date",
        "dataDateFormat": "YYYY-MM-DD HH:NN:SS",

        "autoMargins": true,
        "mouseWheelScrollEnabled": true,
        "mouseWheelZoomEnabled": true,
        "zoomOutOnDataUpdate": true,
        "maxZoomFactor": 21,

        "touchClickDuration": 2,
        "export": {
            "enabled": true
        },
        "categoryAxis": {
            "autoRotateAngle": 0,
            "minPeriod": "ss",
            "parseDates": true,
            "startOnAxis": true,
            "centerLabels": true,
            "labelRotation": 16.2
        },
        "valueScrollbar": {
            "enabled": true,
            "dragIcon": "dragIconRectBig",
            "graphType": "line",
            "hideResizeGrips": true
        },
        "chartCursor": {
            "enabled": true,
            "categoryBalloonDateFormat": "YYYY-MM-DD JJ:NN:SS"
        },
        "chartScrollbar": {
            "enabled": true,
            "backgroundAlpha": 0,
            "dragIcon": "dragIconRectBig",
            "graph": "AmGraph-1",
            "graphFillColor": "#000000",
            "graphLineColor": "#000000",
            "graphType": "column",
            "hideResizeGrips": true,
            "tabIndex": 0,
            "updateOnReleaseOnly": true
        },
        "trendLines": [],
        "graphs": [{
            "bullet": "round",
            "id": "AmGraph-1",
            "lineColor": "#d1655d",
            "negativeLineColor": "#637bb6",
            "title": "sonde 1",
            "type": "smoothedLine",
            "valueField": "value",
            "useLineColorForBulletBorder": true

        }],
        "guides": [],
        "valueAxes": [{
            "axisAlpha": 0,
            "id": "ValueAxis-1",
            "radarCategoriesEnabled": true,
            "title": "C°",
            "titleColor": "#4B0082",
            "titleFontSize": 18
        }],
        "allLabels": [],
        "balloon": {
            "horizontalPadding": 12
        },
        "legend": {
            "enabled": false,
            "useGraphSettings": true
        },
        "titles": [{
            "id": "Title-1",
            "size": 15,
            "text": "Visionneuse de courbes"
        }],

    });

    chart.addLabel(0, '50%', 'Pas de données disponibles', 'center', "24", "#CC0000");

    //script on dataUpdated
    chart.addListener("dataUpdated", function(event) {

        if (1 == chart.dataProvider.length) {
            chart.clearLabels();
            // redraw it
            chart.validateNow();
        }

    });

    function setDataSet(dataset) {
        //Adding new data to array
        chartData.push(AmCharts.parseJSON(dataset));
        //chartData = AmCharts.parseJSON(dataset);
        //error check (invalid or empty data)
        console.log("chartData ", chartData);
        if ((Object.keys(chartData).length === 0 || chartData === null) && chartData.constructor === Array) {

            data = [];
            chart.clearLabels();
            //notify the user
            chart.addLabel("45%", "45%", "Pas de données disponibles", "left", "24", "#CC0000");
        } else {

            console.log("provider ", chart.dataProvider);
            // remove the value from the beginning so that
            // we get nice sliding graph feeling
            if (chartData.length > 29)
                chart.dataProvider.shift();
            chart.dataProvider = chartData;
            //chart.dataProvider = chartData;
            chart.validateData();
        }


    };


});
