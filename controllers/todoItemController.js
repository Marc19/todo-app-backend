const connection = require('../db/dbConnection');

exports.createTodoItem = async (req, res) => {
    // validate input
    const todoItem = {
        title: req.body.title,
        dueDate: req.body.dueDate,
        isCompleted: false
    };

    const constructedQuery = insertQueryCreator(todoItem.title, todoItem.dueDate, todoItem.isCompleted);
    try {
        const insertResultStatus = await query(constructedQuery);
        const constructedQueryOfGet = getQueryCreator(insertResultStatus.insertId);

        var result = await query(constructedQueryOfGet);

        if(result && result[0]){
            result = result[0];
            result = {...result, is_completed: result.is_completed == 0? false : true};
            // console.log(result);
            res.status(201).send(result);
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.getTodoItems = async (req, res) => {
    const constructedQuery = getQueryCreator();
    try {
        let result = await query(constructedQuery);
        result = result.map(r => ({...r, is_completed: (r.is_completed == 0? false : true)}));
        // console.log(result);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.getTodoItem = async (req, res) => {
    const constructedQuery = getQueryCreator(req.params.id);
    
    try {
        let result = await query(constructedQuery);
        if(!result || result.length == 0){
            res.status(404).send();
        }
        else{
            result = result[0];
            result = {...result, is_completed: result.is_completed == 0? false : true};
            // console.log(result);
            res.send(result);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.updateTodoItem = async (req, res) => {
    //validate input
    const todoItem = {
        itemId: req.params.id,
        title: req.body.title,
        dueDate: req.body.dueDate,
        isCompleted: req.body.isCompleted
    };

    const constructedQuery = updateQueryCreator(todoItem.itemId, todoItem.title, todoItem.dueDate, todoItem.isCompleted);
    try {
        var result = await query(constructedQuery);
        const constructedQueryOfGet = getQueryCreator(todoItem.itemId);
        // console.log(result);
        if(result && result.affectedRows == 1){
            result = await query(constructedQueryOfGet);
            if(!result || result.length == 0){
                res.status(404).send();
            }
            else{
                result = result[0];
                result = {...result, is_completed: result.is_completed == 0? false : true};
                // console.log(result);
                res.send(result);
            }
        }
        else{
            res.status(404).send();
        }

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.deleteTodoItem = async (req, res) => {
    const constructedQuery = deleteQueryCreator(req.params.id);

    try {
        var result = await query(constructedQuery);
        // console.log(result);
        if(result && result.affectedRows == 1){
            res.send("Deleted successfully");
        }
        else{
            res.status(404).send();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

async function query(query){
    return new Promise( (resolve, reject) => {
        connection.query(query, function (error, results, fields) {
            if (error) {
                reject(error);
            }
            else {
                // console.log('results: ', results);
                resolve(results);
            }
        });
    });
}

function insertQueryCreator(title, dueDate, isCompleted){
    return "INSERT INTO `todo-items`.`items` (title, due_date, is_completed) VALUES ('" +
    title +
    "', '" + 
    dueDate +
    "', " +
    (isCompleted? 1 : 0 ) +
    ");";
}

function getQueryCreator(id){
    return "SELECT * FROM `todo-items`.items" +
    (id? (" WHERE item_id = " + id + ";") : ";");
}

function updateQueryCreator(id, title, dueDate, isCompleted){
    return "UPDATE `todo-items`.`items` SET title = '" +
    title +
    "', due_date = '" +
    dueDate +
    "', is_completed = " + 
    (isCompleted? 1 : 0) +
    " WHERE item_id = " +
    id +
    ";";
}

function deleteQueryCreator(id){
    return "DELETE FROM `todo-items`.`items` WHERE item_id = " + 
    id + 
    ";";
}
