function forEach2(a) {
    var l = devices.length;
    for (var i = 0; i < l; i++) a(devices[i], i)
}
var on = 0;
var off = 0;
forEach2(function(item) {
    item.status == 1 ? on++ : off++
})

Circles.create({
    id: 'circles-1',
    radius: 40,
    value: on,
    maxValue: devices.length,
    width: 7,
    //text: function(value) { return value + '%'; },
    colors: ['#dddddd', '#87CB16'],
    duration: 400,
    wrpClass: 'circles-wrp',
    textClass: 'circles-text',
    styleWrapper: true,
    styleText: true
});
Circles.create({
    id: 'circles-2',
    radius: 40,
    value: off,
    maxValue: devices.length,
    width: 7,
    //text: function(value) { return value + '%'; },
    colors: ['#dddddd', '#FF4A55'],
    duration: 400,
    wrpClass: 'circles-wrp',
    textClass: 'circles-text',
    styleWrapper: true,
    styleText: true
})
