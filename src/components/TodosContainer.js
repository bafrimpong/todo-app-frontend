import React, { Component } from 'react';
import axios from 'axios';
import update from 'immutability-helper';

class TodosContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            todos: [],
            inputValue: ''
        }
    }

    // a function to fetch or get all the list of dotos from the backend api 
    // using axios
    getTodos(){
        axios.get('/api/v1/todos')
        .then(response => {
            this.setState({ todos: response.data })
            console.log(response.data)
        })
        .catch( error => console.log(error) )
    }

    // a function to create a new item
    createTodo = (e) =>{
        if (e.key === 'Enter') {
            axios.post('/api/v1/todos', {todo: {title: e.target.value}})
            .then(response => {
                const todos = update(this.state.todos, {
                    $splice: [[0, 0, response.data]]
                })
                this.setState({ 
                    todos: todos,
                    inputValue: ''
                })
            })
            .catch(error => console.log(error))
        }
    }

    // a function to update the todo
    updateTodo = (e, id) => {
        axios.put(`/api/v1/todos/${id}`, {todo: {done: e.target.checked} })
        .then(response => {
            const todoIndex = this.state.todos.findIndex(x => x.id === response.data.id)
            const todos = update(this.state.todos, {
                [todoIndex]: {$set: response.data}
            })
            this.setState({
                todos: todos
            })
            
        })
        .catch(error => console.log(error))
    }

    deleteTodo = (id) => {
        axios.delete(`/api/v1/todos/${id}`)
        .then(response => {
            const todoIndex = this.state.todos.findIndex(x => x.id === id)
            const todos = update(this.state.todos, {
                $splice: [[todoIndex, 1]]
            })
            this.setState({
                todos: todos
            })
        })
        .catch(error => console.log(error))
    }

    // handles the change of the textbox for todo title
    handleChange = (e) => {
        this.setState({
            inputValue: e.target.value
        });
    }

    componentDidMount(){
        // call the getTodos() function
        this.getTodos()
    }

    render() { 
        return ( 
            <div>
                <div className="inputContainer">
                    <input className="taskInput" type="text" placeholder="Add a task" maxLength="50" onKeyPress={this.createTodo} />
                </div>
                <div className="listWrapper">
                    <ul className="taskList">
                        {/* create a list from the todos-list */}
                        { this.state.todos.map((todo) => {
                            return(
                                <li className="task" todo={todo} key={todo.id}>
                                    <input className="taskCheckbox" type="checkbox" 
                                        checked={todo.done} 
                                        onChange={(e) => this.updateTodo(e, todo.id)} />
                                    <label className="taskLabel">{todo.title}</label><br />
                                    <small><label className="taskLabel small">{todo.comment}</label></small>
                                    <span className="deleteTaskBtn" onClick={(e)=> this.deleteTodo(todo.id)}>x</span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

export default TodosContainer;