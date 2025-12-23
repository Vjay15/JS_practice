const router = require("express").Router();
const { v4 } = require("uuid");
const fs = require('fs').promises;
const path = require('path');
const objs = require('../state');
const check_auth = require("../middleware/check_auth");
const { createReadStream } = require("fs");

const TODOS_FILE = path.join(__dirname, '../data/todos.json');

// Helper function to read todos from file
async function readTodos() {
    try {
        const data = await fs.readFile(TODOS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

// Helper function to write todos to file
async function writeTodos(todos) {
    // Ensure directory exists
    const dir = path.dirname(TODOS_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

router.get("/download", async (req, res) => {
   res.download(TODOS_FILE) ;
})


router.get("", async (req, res) => {
    try {
        // Check if id is provided as query parameter
        if (req.query.id) {
            const todos = await readTodos();
            const todo = todos.find(todo => todo.id === req.query.id);
            
            if (todo) {
                objs.getRecord = JSON.stringify(todo, null, 2);
            } else {
                objs.getRecord = JSON.stringify({ error: "The id is not present in the list of todos" }, null, 2);
            }
            return res.redirect("/home");
        }
        
        // Otherwise, return all todos
        const todos = await readTodos();
        objs.getRecords = JSON.stringify(todos, null, 2);
        return res.redirect("/home");
    } catch (error) {
        objs.getRecords = JSON.stringify({ error: 'Failed to read todos' }, null, 2);
        return res.redirect("/home");
    }
})

router.get("/:id", async (req, res) => {
    try {
        // Check both path parameter and query parameter
        const id = req.params.id || req.query.id;
        const todos = await readTodos();
        const todo = todos.find(todo => todo.id === id);
        
        if (todo) {
            objs.getRecord = JSON.stringify(todo, null, 2);
        } else {
            objs.getRecord = JSON.stringify({ error: "The id is not present in the list of todos" }, null, 2);
        }
        
        return res.redirect("/home");
    } catch (error) {
        objs.getRecord = JSON.stringify({ error: 'Failed to read todos' }, null, 2);
        return res.redirect("/home");
    }
})

router.post("", async (req, res) => {
    try {
        const title = req.body.title;
        const todos = await readTodos();
        
        const todo = {
            id: v4(),
            title,
            completed: false
        };
        
        todos.push(todo);
        await writeTodos(todos);
        objs.postRecord = JSON.stringify(todo, null, 2);
        return res.redirect("/home");
    } catch (error) {
        objs.postRecord = JSON.stringify({ error: 'Failed to create todo' }, null, 2);
        return res.redirect("/home");
    }
})

router.put("/:id",check_auth, async (req, res) => {
    try {
        const id = req.params.id;
        const todos = await readTodos();
        const index = todos.findIndex(todo => todo.id === id);
        if(index != -1){
            todos[index].completed = !todos[index].completed;
            writeTodos(todos)
            return res.json(todos[index]);
        }
        else{
            return res.json({'error':'id not found'})
        }
    }
    catch(err){
        throw err;
    }
}
)

router.delete("/:id",check_auth, async (req, res) => {
    try {
        const id = req.params.id;
        const todos = await readTodos();
        const index = todos.findIndex(todo => todo.id === id);
        if(index!=-1){
            const filtered_todos = todos.filter(todo => todo.id != id);
            writeTodos(filtered_todos);
            return res.status(200).json(filtered_todos);
        }
        else{
            return res.json({'error':'The id was not found in the todos list'});
        }
    }
    catch(err){
        throw err;
    }
})

module.exports = router;