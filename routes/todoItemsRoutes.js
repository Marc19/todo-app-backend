const express= require('express');
const router = express.Router();
const todoItemController = require('../controllers/todoItemController');

router.post('/', todoItemController.createTodoItem);

router.get('/', todoItemController.getTodoItems);

router.get('/:id', todoItemController.getTodoItem);

router.put('/:id', todoItemController.updateTodoItem);

router.delete('/:id', todoItemController.deleteTodoItem);

module.exports = router;