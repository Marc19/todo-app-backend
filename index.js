const express = require('express');
var cors = require('cors')

const todoItems = require('./routes/todoItemsRoutes');
const PORT = 2750;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/todoItem', todoItems);

app.listen(PORT, () => console.log(`Listening on port ${PORT}:`));