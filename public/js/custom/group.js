//add member
$("#addMember").on('submit', function(event) {

    console.log("submit");
    $.ajax({
            method: "POST",
            url: "group",
            data: $('#addMember').serialize()
            //dataType: "json",
        })
        .done(function(msg) {
            console.log("success");
            $.notify({
                icon: 'pe-7s-gift',
                message: msg

            }, {
                type: 'success',
                timer: 4000,
                z_index: 1051
            });
            console.log("inviter:");
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

//delete member(s)
$("#btn-remove").click(function(event) {


    console.log("delete:");
    var ids = $.map($("#bsTable").bootstrapTable('getSelections'), function(row) {
        return row.userName;
    });
    console.log(ids);


    $.ajax({
            method: "DELETE",
            url: "group",
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
                field: 'userName',
                values: ids
            });
        });

    /* stop form from submitting normally*/
    event.preventDefault();
    return false;
});
//delete member(s) ;
//accept/ignore invitation
$("#alerts").on('click', '#accept , #ignore', function(event) {


    var idbtn = event.target.id;
    console.log("clicked ", idbtn);
    console.log("admin ", event.target.getAttribute("admin"));
    if (idbtn == "accept") {
        var method = "PUT";
    } else if (idbtn == "ignore") {
        var method = "DELETE";
    }

    $.ajax({
            method: method,
            url: ("group/" + event.target.getAttribute("admin")),
            data: {
                admin: event.target.getAttribute("admin")
            }
        })
        .done(function(res) {
            console.log("success");
            console.log(res);
            console.log(res.msg);
            $.notify({
                icon: 'pe-7s-gift',
                message: res.msg

            }, {
                type: 'success',
                timer: 4000,
                z_index: 1051
            });
            console.log("accept:");
            $("#admin" + res.admin).remove();

        });



    /* stop form from submitting normally*/
    event.preventDefault();
    return false;
});
//accept/ignore invitation ;

// bootstrapTable
$('#bsTable').bootstrapTable({
    //url: '/test/group.json',
    data: membersData,
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
    idField: 'userName',
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
        class: 'bs-checkbox-custom col-xs-1',

    }, {
        field: 'id',
        title: 'ID',
        sortable: true,
        //class: 'col-xs-1 text-center',
        cellStyle: function cellStyle(value, row, index, field) {
            return {
                classes: 'col-xs-1 text-center'
            }
        }
        /*
        formatter: function (value, row, index) {
                        return (1 + index);
                    }
                    */
    }, {
        field: 'userName',
        title: 'utilisateur',
        class: 'col-md-3',
        sortable: true
    }, {
        field: 'firstName',
        title: "nom",
        class: 'col-xs-1',
        visible: false
        //clickToSelect: false,
    }, {
        field: 'lastName',
        title: 'prénom',
        class: 'col-xs-1',
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
    onEditableShown: function(editable, field, row, $el) {
        console.log("shown:");
        console.log(editable);
        console.log(field);
        console.log(row);
        console.log($el);
        console.log(this);
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
