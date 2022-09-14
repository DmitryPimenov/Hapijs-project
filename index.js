// Получение всех позиций
function GetLists() {
    $.ajax({
        url: "/api/lists",
        type: "GET",
        contentType: "application/json",
        success: function (lists) {
            var rows = "";
            $.each(lists, function (index, list) {
// добавляем полученные элементы в таблицу
                rows += row(list);
            })
            $("table tbody").append(rows);
         }
    });
}
// Получение одной позиции
function GetList(id) {
    $.ajax({
        url: "/api/lists/"+id,
        type: "GET",
        contentType: "application/json",
        success: function (list) {
            var form = document.forms["listForm"];
            form.elements["id"].value = list.id;
            form.elements["name"].value = list.name;
            form.elements["type"].value = list.type;
         }
    });
}
// Добавление позиции
function CreateList(listName, listType) {
    $.ajax({
        url: "api/lists",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            name: listName,
            type: listType
        }),
        success: function (list) {
            reset();
        $("table tbody").append(row(list));
        }
    });
}
// Изменение позиции
function EditList(listId, listName, listType) {
    $.ajax({
        url: "api/lists",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: listId,
            name: listName,
            type: listType
        }),
        success: function (list) {
            reset();
        $("tr[data-rowid='" + list.id + "']").replaceWith(row(list));
        }
    })
}
// сброс формы
function reset() {
        var form = document.forms["listForm"];
        form.reset();
        form.elements["id"].value = 0;
      }
// Удаление позиции
function DeleteList(id) {
    $.ajax({
        url: "api/lists/"+id,
        contentType: "application/json",
        method: "DELETE",
        success: function (list) {
        console.log(list);
        $("tr[data-rowid='" + list.id + "']").remove();
        }
    })
}
// создание строки для таблицы
var row = function (list) {
    return "<tr data-rowid='" + list.id + "'><td>" + list.id + "</td>" +
               "<td>" + list.name + "</td> <td>" + list.age + "</td>" +
               "<td><a class='editLink' data-id='" + list.id + "'>Изменить</a> | " +
               "<a class='removeLink' data-id='" + list.id + "'>Удалить</a></td></tr>";
      }
// сброс значений формы
$("#reset").click(function (e) {
        e.preventDefault();
        reset();
})

// отправка формы
$("form").submit(function (e) {
        e.preventDefault();
        var id = this.elements["id"].value;
        var name = this.elements["name"].value;
        var type = this.elements["type"].value;
        if (id == 0)
            CreateList(name, type);
        else
            EditList(id, name, type);
});

// нажимаем на ссылку Изменить
$("body").on("click", ".editLink", function () {
        var id = $(this).data("id");
        GetList(id);
})
// нажимаем на ссылку Удалить
$("body").on("click", ".removeLink", function () {
        var id = $(this).data("id");
        DeleteList(id);
})

// загрузка позиций
GetLists();
