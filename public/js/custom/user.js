//add member
$("#profile").on('submit', function(event) {

    console.log("submit");
    $.ajax({
            method: "PUT",
            url: "user",
            data: $('#profile').serialize()
            //dataType: "json",
        })
        .done(function(msg) {
            console.log("success");
            console.log(msg);
            $.notify({
                icon: 'pe-7s-gift',
                message: msg

            }, {
                type: 'success',
                timer: 4000,
                z_index: 1051
            });
        })
        .fail(function(jqXHR) {

            $.notify({
                icon: 'pe-7s-gift',
                message: jqXHR.responseText
            }, {
                type: 'danger',
                timer: 4000,
                z_index: 1051
            });
        });


    // stop form from submitting normally
    event.preventDefault();
    return false;
});
// add member ;
//change password
$("#updatePass").on('submit', function(event) {

    console.log("submit");
    $.ajax({
            method: "POST",
            url: "user",
            data: $('#updatePass').serialize()
            //dataType: "json",
        })
        .done(function(msg) {
            console.log("success");
            console.log(msg);
            $.notify({
                icon: 'pe-7s-gift',
                message: msg

            }, {
                type: 'success',
                timer: 4000,
                z_index: 1051
            });
        })
        .fail(function(jqXHR) {

            $.notify({
                icon: 'pe-7s-gift',
                message: jqXHR.responseText
            }, {
                type: 'danger',
                timer: 4000,
                z_index: 1051
            });
        });


    // stop form from submitting normally
    event.preventDefault();
    return false;
});
// change password ;
