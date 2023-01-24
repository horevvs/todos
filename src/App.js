
import React, { useEffect, useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';





function App() {
  const [todo, setTodo] = useState([])
  const [inputs, setInputs] = useState([])
  const [list, setList] = useState([])
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

  //////////////////////////////
  const addfrominput = () => {
    let random = Math.random().toFixed(2) * 100
    setList([...list, { value: inputs, id: random }])
    setTodo([...todo, { name: inputs, id: random }])
    let index = list.at();
    let obj = {
      name: index.value
    }
    fetch('https://todo.soprano.biz/note',
      {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    )
    document.location.reload();
  }
  ///////////////////////////////
  const deletehandler = (id) => {
    fetch(`https://todo.soprano.biz/note/${id}`, {
      method: 'DELETE',
    });
    document.location.reload();
  }

  /////////////////////////
  const deletetask = (id) => {
    alert(id)
    fetch(`https://todo.soprano.biz/task/${id}`, {
      method: 'DELETE',
    });
    document.location.reload();
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
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          }
        })
        fetch('https://todo.soprano.biz/task',
          {
            method: 'POST',
            body: JSON.stringify(objtask),
            headers: { 'Content-type': 'application/json; charset=UTF-8', },
          }
        )
      }
    document.location.reload();
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
    let b = task.filter(item => {
      if (id === item.note_id) { return true }
    })
    setTaskfiltered(b)
    console.log(b)
    // document.location.reload();
  }

  ////////////////////////////////////
  const send = (id, note_id) => {

    alert(id)

    alert(note_id)

  }


  return (
    <div>
      <div className='position'>
        <TextField id="standard-basic" variant="standard" placeholder=' type notes ' value={inputs} onChange={(e) => setInputs(e.target.value)} />
        <Button variant="contained" size="small" onClick={addfrominput} > Add  Notes  </Button>
      </div>
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
                  <TextField id="standard-basic" variant="standard" placeholder=' type notes ' value={inputs} onChange={(e) => setInputs(e.target.value)} />
                  <Button onClick={() => send(item.id, item.subject)} >  edit </Button>
                </div>
              </div>
            )
          })
        }</div>
    </div >
  );
}

export default App;
