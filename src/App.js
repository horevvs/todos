
import React, { useEffect, useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import Maininput from './components/Maininput';

function App() {
  const [todo, setTodo] = useState([])
  const [edit, setEdit] = useState([])
  const [task, setTask] = useState([])
  const [taskfiltered, setTaskfiltered] = useState([])

  useEffect(() => {
    fetch('https://todo.soprano.biz/note/')
      .then((response) => {
        // Проверяем успешность запроса 
        if (response.status !== 200) { console.log(response.status); }
        return response.json()
      }
      )
      .then((data) => setTodo(data))
  }, [todo])

  useEffect(() => {
    fetch('https://todo.soprano.biz/task/')
      .then((response) => response.json())
      .then((data) => setTask(data))
  }, [])
 
  ///////////////////////////////
  const deletehandler = (id) => {
    fetch(`https://todo.soprano.biz/note/${id}`, {
      method: 'DELETE',
    }).then(
      (response) => {
        // Проверяем, что сервер ответил ОК и только потом обновляем state нашего UI объекта
        if (response.status === 200) {
          fetch('https://todo.soprano.biz/note/')
            .then((data) => setTodo(data))
        }
      }
    )
  }

  /////////////////////////
  const deletetask = (id) => {
    fetch(`https://todo.soprano.biz/task/${id}`, {
      method: 'DELETE',
    })
    fetch('https://todo.soprano.biz/task')
      .then(
        (response) => {
          // Проверяем, что сервер ответил ОК и только потом обновляем state нашего UI объекта
          if (response.status == 200) {
          }
        }
      )
  }

  //////////////////////////
  const checkbox = (id) => {
    let objtask = {
      subject: `done`,
      resolved: true
    }
    for (let i = 0; i < task.length; i++)
      if (task[i].id === id) {
        let thisname = task[i].id
        let url = `https://todo.soprano.biz/task/${thisname}`
        fetch(url, {
          method: 'PUT',
          body: JSON.stringify(objtask),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          }
        })
          .then(
            (response) => {
              // Проверяем, что сервер ответил ОК и только потом обновляем state нашего UI объекта
              if (response.status == 200) {
                ////////////////////////////////// как то надо обновить ссотояние
              setTask(task)
                ////////////////////////////
                console.log(response.status);
              }
            }
          )
      }
  }

  ////////////////////////
  const addTask = (id) => {
    let objtask = {
      subject: edit,
      note_id: id,
      resolved: false
    }
    fetch('https://todo.soprano.biz/task',
      {
        method: 'POST',
        body: JSON.stringify(objtask),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    )
    //  надо получить массив с отфильтрованными таксками по id
    let result = task.filter(item => {
      if (id === item.note_id) { return true }
    })
    setTaskfiltered(result)
  }

  return (
    <div>
      <Maininput/>
      <div className='position'>
        {todo.map((item) => {
          return (
            <div key={item.id} className='opasity'>
              <div className='notes'>
                <span className='task'  >   {item.name}   </span>
                <Button variant="text" onClick={() => deletehandler(item.id)}> delete Notes</Button> <br />
                <input type="text" placeholder='add text for edit task' value={edit} onChange={(e) => setEdit(e.target.value)} />
                <Button onClick={() => addTask(item.id, item.note_id)} >  add task </Button>
                <Button onClick={() => addTask(item.id, item.note_id)} >  Show task </Button>
              </div>
            </div>
          )
        })
        }
      </div>

      <div className='position'>
        <div> <h2> List of tasks</h2></div>{
          taskfiltered.map((item) => {
            return (
              <div>
                <div key={item.note_id} className='board'>
                  <input type="checkbox" checked={item.resolved} ></input>
                  <span onClick={() => checkbox(item.id)} className='pointer' >  {item.subject} </span>
                  <Button variant="text" onClick={() => deletetask(item.id)}> delete task</Button>
                </div>
              </div>
            )
          })
        }</div>
    </div >
  );
}
export default App;
