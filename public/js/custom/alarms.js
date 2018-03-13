$(document).ready(function() {

    $("#list > div > h4 > a").click(function() {
        $("#list").toggleClass("panel-success");
        $("#trigger").removeClass("panel-success");
        $("#trigger").addClass("panel-default");
    });
    $("#trigger > div > h4 > a").click(function() {
        $("#trigger").toggleClass("panel-success");
        $("#list").removeClass("panel-success");
        $("#list").addClass("panel-default");
    });
    if (alarms.length > 0) {
        $("#noteLists:first-child").html("")
    }
    for (var i = 0; i < alarms.length; i++) {

        $("#noteLists").append(
            "<div id='note" + alarms[i].id + "' class='alert alert-danger'>" +
            "<button note='" + alarms[i].id + "' type='button' aria-hidden='true' class='close'>&#x2717;</button>" +
            "<span>" + alarms[i].userAlarmId.description + "</span>" +
            "</div>"
        )

    };

    //view notification
    $("#noteLists").on('click', 'button', function(event) {
        console.log("notes");

        var idbtn = event.target.parentNode.id;
        var id = event.target.getAttribute("note");
        console.log("clickedP ", idbtn);
        console.log("clicked ", id);
        //console.log("admin ", event.target.getAttribute("admin"));
        if (idbtn.substr(0, 4) === "note") {

            $.ajax({
                    method: "put",
                    url: ("alarms/" + id),
                    data: {
                        alarm: id
                    }
                })
                .done(function(res) {
                    console.log("success");
                    console.log(res);
                    console.log("effected");
                    console.log("accept:");

                    $("#note" + id).remove();
                    var l = $("#" + idbtn).length;
                    console.log();
                    if (l == 0) {
                        console.log("no");
                        $("#noteLists").html("<span>aucune notification disponible</span>");
                    }
                });
        }


        /* stop form from submitting normally*/
        event.preventDefault();
        return false;
    });
    //view notification ;

    // upsert notif
    $("#trigger").on('submit', function(event) {

        console.log("submit");
        var ids = $.map($("#bsTable").bootstrapTable('getSelections'), function(row) {
            return row.ref;
        });
        console.log("form ", $("#trigger").find('input[name="min"]').val());
        console.log("ids ", ids[0]);
        var form = $('#trigger').serialize();

        $.ajax({
                method: "POST",
                url: "alarms",
                data: {
                    desc: $("#trigger").find('textarea[name="desc"]').val(),
                    min: $("#trigger").find('input[name="min"]').val(),
                    max: $("#trigger").find('input[name="max"]').val(),
                    device: ids[0]
                }
            })
            .done(function(res) {
                console.log("success");
                console.log(res);
                $.notify({
                    icon: 'pe-7s-gift',
                    message: res
                }, {
                    type: 'success',
                    timer: 4000,
                    z_index: 1051
                });
                console.log("insert:");
            }).fail(function(jqXHR) {
                $.notify({
                    icon: 'pe-7s-gift',
                    message: jqXHR

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
    // upsert notif ;

    // bootstrapTable
    $('#bsTable').bootstrapTable({
        //url: '/test/devices.json',
        data: devicesData,
        //method: 'get',
        sortName: 'id',
        sortOrder: 'desc',
        classes: 'table',
        pagination: true,
        paginationPreText: "<i class='fa fa-caret-left fa-lg'></i>",
        paginationNextText: "<i class='fa fa-caret-right fa-lg'></i>",
        pageList: '[10, 25]',
        search: true,
        showColumns: true,
        showRefresh: true,
        showToggle: true,
        idField: 'ref',
        clickToSelect: true,
        toolbar: '#toolbar',
        locale: 'fr-FR',
        /*
        rowStyle: function(row, index) {
            if (row.status === 1) {
                return {
                    classes: 'success'
                };
            } else {
                return {
                    classes: 'danger'
                };
            }

        },*/
        columns: [{
            field: 'check',
            radio: true,
            width: '20px',
            class: 'bs-checkbox-custom col-xs-1'

        }, {
            field: 'ref',
            title: 'Item ref',
            class: 'col-md-3'
        }, {
            field: 'name',
            title: "Item Name",
            class: 'col-md-2',
            sortable: true,
            clickToSelect: false
        }],
        onCheckAll: function(rows) {
            $('#btn-remove').prop("disabled", false);
            $('#btn-assign').prop("disabled", false);
        },
        onUncheckAll: function(rows) {
            $('#btn-remove').prop("disabled", true);
            $('#btn-assign').prop("disabled", true);
        },
        onCheck: function(row, $element) {
            console.log("check");
            $('#btn-remove').prop("disabled", false);
            $('#btn-assign').prop("disabled", false);
        },
        onUncheck: function(row, $element) {
            if (!$('#bsTable').bootstrapTable('getSelections').length) {
                console.log("selecions empty");
                $('#btn-remove').prop("disabled", true);
                $('#btn-assign').prop("disabled", true);
            } else {
                console.log("selecions not empty");
                console.log("array : " + $('#bsTable').bootstrapTable('getSelections'));

            }
        },
    });
    // bootstrapTable ;
    $("input[name='max']").change(function() {
        console.log($("#trigger").find('input[name="min"]').val());
        if ($("#trigger").find('input[name="min"]').val() != "") {
            if ($("#trigger").find('input[name="max"]').val() < $("#trigger").find('input[name="min"]').val()) {
                var val = parseInt($("input[name='min'").val() + 1)
                $("input[name='max'").val();
            }
        }
    });
    $("input[name='min']").change(function() {
        console.log($("#trigger").find('input[name="max"]').val());
        if ($("#trigger").find('input[name="max"]').val() != "") {
            if ($("#trigger").find('input[name="min"]').val() < $("#trigger").find('input[name="max"]').val()) {
                $("input[name='min'").val($("input[name='max']").val() - 1);
            }
        }
    });
    //  document end ==============================================================
});
