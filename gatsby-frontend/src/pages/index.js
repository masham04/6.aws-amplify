import React, { useState, useRef, useEffect } from "react"
import { addTodo } from "../graphql/mutations"
import { getTodos } from "../graphql/queries"
import { deleteTodo } from "../graphql/mutations"
import { API } from "aws-amplify"
import shortid from "shortid"


export default function Home() {
  const [loading, setLoading] = useState(true)
  const [todoData, setTodoData] = useState(null)
  const todoTitleRef = useRef("")

  console.log(todoData)

  const addTodoMutation = async () => {
    try {
      const todo = {
        id: shortid.generate(),
        title: todoTitleRef.current.value,
        done: false,
      }
      await API.graphql({
        query: addTodo,
        variables: {
          todo: todo,
        },
      })
      todoTitleRef.current.value = ""
      fetchTodos()
    } catch (e) {
      console.log(e)
    }
  }
  const deleteTodoMutation = async (el) => {

    try {
      await API.graphql({
        query: deleteTodo,
        variables: {
          todoId: el,
        },
      })
      fetchTodos()
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTodos = async () => {
    try {
      const data = await API.graphql({
        query: getTodos,
      })
      setTodoData(data)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div>
      {loading ? (
        <h1>Loading ...</h1>
      ) : (
        <div>
          <label>
            Todo:
            <input ref={todoTitleRef} />
          </label>
          <button onClick={() => addTodoMutation()}>Create Todo</button>
          {todoData.data &&
            todoData.data.getTodos.map((item, ind) => (
              <div style={{ marginLeft: "1rem", marginTop: "2rem" }} key={ind}>
                {item.title}
                <button onClick={() => { deleteTodoMutation(item.id) }}>Delete</button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}