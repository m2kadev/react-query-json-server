import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getTodos, updateTodo, deleteTodo, addTodo } from '../../api/todosAPI'

const TodoList = () => {

  const [newTodo, setNewTodo] = useState('')
  const queryClient = useQueryClient()

  const { isLoading, isError, error, data: todos } = 
  useQuery('todos', getTodos,
  {
    select: data => data.sort((a, b) => b.id - a.id)
  })

  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos')
    }
  })

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos')
    }
  })

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    addTodoMutation.mutate({userId: 1, title: newTodo, completed: false})
    setNewTodo('')
  }

  const newItemSection = () => (
    <form onSubmit={handleSubmit}>
        <label>Add New Todo</label>
        <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
        <button type='submit'>Add</button>
    </form>
  )

  let content 

  if (isLoading) {
    content = <p>Loading ...</p>
  } else if (isError) {
    content = <p>{error.message}</p>
  } else {
    content = todos.map(todo => (
      <div>
        <p>{todo.title}</p>
        <input 
        type="checkbox"
        checked={todo.completed}
        onChange={() => updateTodoMutation.mutate({...todo, completed: !todo.completed})}
        />
        <button onClick={() => deleteTodoMutation.mutate({...todo})}>Delete</button>
      </div>
    ))
  }

  return (
    <main>
      {newItemSection()}
      {content}
    </main>
  )
}

export default TodoList