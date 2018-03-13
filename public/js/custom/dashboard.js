$(document).ready(function() {
    var path = (window.location.pathname).split('/').slice(3).join('/');
    var menu = path.substr(0, (path.indexOf('/') === -1 ? path.length : path.indexOf('/')));

    /*
    var flashMsg = "{{- @flash}}";
    if (cbk.length > 0) {
        $.notify({
            icon: 'pe-7s-gift',
            message: flashMsg

        }, {
            type: 'warning',
            timer: 3000,
            z_index: 1051
        });
    }
    */
    console.log(userN);
    $.ajax({
            method: "GET",
            url: ("/dashboard/" + userN + "/getAlarms")
        })
        .done(function(res) {
            console.log("success");
            console.log(res);
            console.log(res.notifications);
            console.log(res.invitations);
            var notes = $("#notifs");
            for (var i = 0; i < res.invitations.length && i < 2; i++) {
                console.log("mem ", res.invitations[i].adminName);
                notes.append("<li><a href='group'>invitation de " + res.invitations[i].adminName + "</a></li>");
                if (menu === "group") {
                    $("#alerts").append(
                        "<div id='admin" + res.invitations[i].groupAdmin + "' class='alert alert-info'>" +
                        "<button id='accept' type='button' aria-hidden='true' admin='" + res.invitations[i].groupAdmin + "' class='close' style='margin-right:33px'>&#x2713;</button>" +
                        "<button id='ignore' type='button' aria-hidden='true' admin='" + res.invitations[i].groupAdmin + "' class='close'>&#x2717;</button>" +
                        "<span><b><i>" + res.invitations[i].adminName + "</i></b> souhaite que vous joindre son groupe</span>" +
                        "</div>"
                    )
                }
            };
            notes.append("<li class='divider'></li>");
            for (var i = 0; i < res.notifications.length && i < 4; i++) {
                notes.append("<li><a href='alarms'>" + res.notifications[i].userAlarmId.description + "</a></li>");
            };

            if (res.notifications.length >= 4)
                notes.append("<li><a href='group'>Voir plus !</a></li>");
            var l = (res.invitations.length + res.notifications.length);
            $(".notification").html(l);
            (l > 0) ? $("#hnotifs").prepend(l + " notification(s)"): $("#hnotifs").prepend(0 + " notification");

        }).fail(function(jqXHR) {
            $.notify({
                icon: 'pe-7s-gift',
                message: "écheck de charger les notification et/ou les invitations"

            }, {
                type: 'danger',
                timer: 4000,
                z_index: 1051
            });
        });


    //initialize tootltips
    $('[data-tooltip="tooltip"]').tooltip();


    //hack for menu change==========================================================

    $("#menuList > li > a[href=" + menu + "]").parent().closest('li').addClass("active");
    console.log(menu);
    switch (menu) {
        case 'data':
            $(".navbar-brand").text('Données');
            break;
        case 'devices':
            $(".navbar-brand").text('Devices');
            break;
        case 'group':
            $(".navbar-brand").text('Groupe');
            break;
        case 'archive':
            $(".navbar-brand").text('Archive');
            break;
        case 'alarms':
            $(".navbar-brand").text('Notifications');
            break;
        case 'user':
            $(".navbar-brand").text('Profil');
            break;
        default:
            $(".navbar-brand").text('Accueil');
    };
});
