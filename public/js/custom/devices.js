$(document).ready(function() {
    console.log("ready!");
    for (var i = 0; i < members.length; i++) {
        $("[name='member']").html(
            "<option>" + members[i].memberName + "</option>"
        )
    }
    //$.fn.editable.defaults.mode = 'inline';
    //add device(s)
    $("#addThing").on('submit', function(event) {

        console.log("submit");
        $.ajax({
                method: "POST",
                url: "devices",
                data: $('#addThing').serialize()
            })
            .done(function(res) {
                console.log("success");
                console.log(res);
                $.notify({
                    icon: 'pe-7s-gift',
                    message: res.msg

                }, {
                    type: 'success',
                    timer: 4000,
                    z_index: 1051
                });
                console.log("insert:");
                var Id = $('#bsTable').bootstrapTable('getOptions').totalRows + 1;

                $('#bsTable').bootstrapTable('insertRow', {
                    index: Id,
                    row: {
                        id: Id,
                        ref: res.device.ref,
                        name: res.device.name,
                        status: res.device.status,
                        lastSeen: res.device.lastSeen
                    }

                });
            }).fail(function(jqXHR) {
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
    // add device(s) ;

    //assign device to user
    $("#assignThing").submit(function(event) {


        console.log("assign:");
        var ids = $.map($("#bsTable").bootstrapTable('getSelections'), function(row) {
            return row.ref;
        });
        console.log(ids);
        console.log('member:');
        var elmt = document.getElementsByName('member')[0];
        console.log(elmt.value);
        console.log($('#assignThing').serialize().constructor.toString());

        $.ajax({
                method: "POST",
                url: "devices/" + elmt.value,
                data: {
                    data: ids,
                    member: elmt.value
                }
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
                console.log("assign:");

            }).fail(function(jqXHR) {
                $.notify({
                    icon: 'pe-7s-gift',
                    message: jqXHR.responseText

                }, {
                    type: 'danger',
                    timer: 4000,
                    z_index: 1051
                });
            });

        /* stop form from submitting normally*/
        event.preventDefault();
        console.log("preventDefault");
        return false;
    });
    // assign device to user ;

    //delete device(s)
    $("#btn-remove").click(function(event) {

        console.log("delete:");
        var ids = $.map($("#bsTable").bootstrapTable('getSelections'), function(row) {
            return row.ref;
        });
        console.log(ids);


        $.ajax({
                method: "DELETE",
                url: "devices",
                data: {
                    data: ids
                }
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
                console.log("delete:");

                console.log(ids);
                $('#bsTable').bootstrapTable('remove', {
                    field: 'ref',
                    values: ids
                });
            }).fail(function(jqXHR) {
                $.notify({
                    icon: 'pe-7s-gift',
                    message: jqXHR.responseText

                }, {
                    type: 'danger',
                    timer: 4000,
                    z_index: 1051
                });
            });

        /* stop form from submitting normally*/
        event.preventDefault();
        return false;
    });
    //delete device(s) ;

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
        pageList: '[10, 25, 50]',
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
            checkbox: true,
            width: '20px',
            class: 'bs-checkbox-custom col-xs-1'

        }, {
            field: 'id',
            title: 'ID',
            sortable: true,
            cellStyle: function cellStyle(value, row, index, field) {
                if (row.status === 'connecté') {
                    return {
                        classes: 'col-xs-1 text-center mod-onLine'
                    };
                } else {
                    return {
                        classes: 'col-xs-1 text-center mod-horsLine'
                    };
                }
            }
            /*
            formatter: function (value, row, index) {
                            return (1 + index);
                        }
                        */
        }, {
            field: 'ref',
            title: 'référence N/S',
            class: 'col-md-3'
        }, {
            field: 'name',
            title: "<span class= 'text-info'><i class= 'fa fa-edit'></i></span> Nom",
            class: 'col-md-2',
            sortable: true,
            clickToSelect: false,
            editable: {
                url: "devices/51",
                type: 'text',
                mode: 'inline',
                validate: function(value) {
                    console.log("validate");
                    if ($.trim(value) == '') {
                        console.log("required");
                        return 'ce champ est obligatoire';
                    }
                },
                ajaxOptions: {
                    type: 'put',
                    //dataType: 'json'
                },
                success: function(response) {
                    $.notify({
                        icon: 'pe-7s-gift',
                        message: response
                    }, {
                        type: 'success',
                        timer: 4000,
                        z_index: 1051
                    });
                },
                error: function(jqXHR) {
                    $.notify({
                        icon: 'pe-7s-gift',
                        message: jqXHR.responseText

                    }, {
                        type: 'danger',
                        timer: 4000,
                        z_index: 1051
                    });
                }
            }
        }, {
            field: 'status',
            title: 'Status',
            class: 'col-xs-1',
            visible: false

        }, {
            field: 'lastSeen',
            title: 'dernière connexion',
            undefinedText: 'jamais',
            visible: false
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
        onEditableSave: function(editable, field, row, oldValue, el) {

            console.log("saved:");
            console.log(editable);
            console.log(field);
            console.log(row);
            console.log(oldValue);
            console.log(el);
            console.log("/saved");
        },
        onEditableInit: function() {
            console.log("init:");
            console.log("/init");
        },
        onEditableShown: function(editable, field, row, $el) {
            console.log("shown:");
            console.log(editable);
            console.log(field);
            console.log(row);
            console.log($el);
            console.log($el);
            row.editable('validate');
            console.log("/shown");
        },
        onEditableHidden: function(field, row, $el, reason) {
            console.log("hidden:");
            console.log(field);
            console.log(row);
            console.log($el);
            console.log(reason);
            console.log("/hidden");
        },
    });
    // bootstrapTable ;


});
