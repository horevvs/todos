
import React, { useEffect, useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import Maininput from './components/Maininput';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [todo, setTodo] = useState([])
  const [edit, setEdit] = useState([])
  const [task, setTask] = useState([])


  useEffect(() => {
    fetch('https://todo.soprano.biz/note/')
      .then((response) => response.json())
      .then((data) => setTodo(data))
  }, [])

  useEffect(() => {
    fetch('https://todo.soprano.biz/task/')
      .then((response) => response.json())
      .then((data) => setTask(data))
  }, [])

  const deletehandler = (id) => {
    fetch(`https://todo.soprano.biz/note/${id}`, {
      method: 'DELETE',
    })
    
    
    
    .then(
      (response) => {
        if (response.status === 200) {
          fetch('https://todo.soprano.biz/note/')
            .then((data) => setTodo(data))
        }
        document.location.reload()
      }

    )
  }

  const deletetask = (id) => {
    fetch(`https://todo.soprano.biz/task/${id}`, {
      method: 'DELETE',
    })
    fetch('https://todo.soprano.biz/task')
      .then((response) => {
        if (response.status === 200) {
          document.location.reload()
        }
      }
      )
  }

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
          headers: { 'Content-type': 'application/json; charset=UTF-8', }
        })
          .then(
            (response) => {
              if (response.status === 200) {
                setTask(task)
                document.location.reload()
              }
            }
          )
      }
  }

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
    
    fetch('https://todo.soprano.biz/task')
    .then((response) => {
      if (response.status === 200) {
        document.location.reload()
      }
    }
    )

    
  }

  const handleChange = (event) => {
    let value = event.target.value;
    setEdit(value);
  }

  return (
    <div>
      <Maininput />
      <div className='position'>
        {todo.map((item) => {
          return (
            <div key={item.id} className='opasity'>
              <div className='notes'>
                <span className='task'  >   {item.name}   </span>
                <Button variant="text" onClick={() => deletehandler(item.id)}> delete Notes</Button> <br />
                <input type="text" placeholder='add text for edit task' name={item.id} value={edit.name} onChange={handleChange} />
                <Button onClick={() => addTask(item.id, item.note_id)} variant="contained" size='small'>  add task </Button>
                {item.tasks.map((item) => {
                  return (
                    <div key={item.id} className='board'>
                      <input type="checkbox" checked={item.resolved} ></input>
                      <span onClick={() => checkbox(item.id)} className='pointer' >  {item.subject} </span>
                      {/* <Button variant="text" onClick={() => deletetask(item.id)}> delete task</Button> */}

                      <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => deletetask(item.id)} size='small'>
                        Delete task
                      </Button>

                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
        }
      </div>


    </div>
  );
}
export default App;
