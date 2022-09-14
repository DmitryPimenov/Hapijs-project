const Hapi = require("hapi");
var bodyParser = require("body-parser");
var fs = require("fs");

const server = new Hapi.Server({
port:3000 || process.env.port
});

var jsonParser = bodyParser.json();

// получение списка данных
server.route({
  method: "GET",
  path: "/api/lists",
  handler: (req, res) => {
    var content = fs.readFileSync("lists.json", "utf8");
    var lists = JSON.parse(content);
    res.send(lists);
  }
});

// получение одной позиции по id
server.route({
  method: "GET",
  path: "/api/lists/:id",
  handler: (req, res) => {
    var id = req.params.id;	// получаем id
    var content = fs.readFileSync("lists.json", "utf8");
    var lists = JSON.parse(content);
    var list = null;
    // находим в массиве позицию по id
    for(var i=0; i<lists.length; i++){
      if(lists[i].id==id){
        list = lists[i];
        break;
      }
    }
    // отправляем позицию
    if(list){
      res.send(list);
    }
    else{
      res.status(404).send();
  }
}
});

// получение отправленных данных
server.route({
  method: "POST",
  path: "/api/lists",
  handler: (jsonParser, req, res) => {
    if(!req.body) return res.sendStatus(400);
    var listName = req.body.name;
    var listType = req.body.type;
    var list = {name: listName, type: listType};

    var data = fs.readFileSync("lists.json", "utf8");
    var lists = JSON.parse(data);

    // находим максимальный id
    var id = Math.max.apply(Math,lists.map(function(o){return o.id;}))
    // увеличиваем его на единицу
    list.id = id+1;
    // добавляем позицию в массив
    lists.push(list);
    var data = JSON.stringify(lists);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("lists.json", data);
    res.send(list);
  }
});

// удаление позиции по id
server.route({
  method: "DELETE",
  path: "/api/lists/:id",
  handler: (req, res) => {
    var id = req.params.id;
    var data = fs.readFileSync("lists.json", "utf8");
    var lists = JSON.parse(data);
    var index = -1;
    // находим индекс позиции в массиве
    for(var i=0; i<lists.length; i++){
      if(lists[i].id==id){
        index=i;
        break;
      }
    }
    if(index > -1){
      // удаляем позицию из массива по индексу
      var list = lists.splice(index, 1)[0];
      var data = JSON.stringify(lists);
      fs.writeFileSync("lists.json", data);
      // отправляем удаленную позицию
      res.send(list);
    }
    else{
      res.status(404).send();
    }
  }
});

// изменение позиции
server.route({
  method: "PUT",
  path: "/api/lists",
  handler: (jsonParser, req, res) => {
    if(!req.body) return res.sendStatus(400);
    var listId = req.body.id;
    var listName = req.body.name;
    var listType = req.body.type;

    var data = fs.readFileSync("lists.json", "utf8");
    var lists = JSON.parse(data);
    var list;
    for(var i=0; i<lists.length; i++){
      if(lists[i].id==listId){
        list = lists[i];
        break;
      }
    }
    // изменяем данные у пользователя
    if(list){
      list.type = listType;
      list.name = listName;
      var data = JSON.stringify(lists);
      fs.writeFileSync("lists.json", data);
      res.send(list);
    }
    else{
      res.status(404).send(list);
    }
  }
});

server.start(error => {
  if(error){
    throw error;
  }
  console.log("Listening at " + server.info.uri)
});
