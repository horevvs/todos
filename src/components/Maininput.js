import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function Maininput() {
    const [todo, setTodo] = useState([])
    const [inputs, setInputs] = useState([])


    useEffect(() => {
        fetch('https://todo.soprano.biz/note/')
            .then((response) => response.json())
            .then((data) => setTodo(data))
    }, [])


    const addfrominput = () => {

        // отправляем запрос на добавление записи на сервер
        fetch('https://todo.soprano.biz/note',
            {
                method: 'POST',
                body: JSON.stringify({ name: inputs }),
                headers: { 'Content-type': 'application/json; charset=UTF-8', },
            }
        )
        .then((response) => {
            // Проверяем, что сервер ответил ОК и только потом обновляем state нашего UI объекта
            if (response.status === 200) {   }
            setTodo([...todo, { name: inputs }])
            document.location.reload()
        })
    }

    return (
        <div className='position'>
            <TextField id="standard-basic" variant="standard" placeholder=' type notes ' value={inputs} onChange={(e) => setInputs(e.target.value)} />
            <Button variant="contained" size="small" onClick={addfrominput} > Add  Notes  </Button>
        </div>
    );
}
export default Maininput;
