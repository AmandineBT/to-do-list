import {useState} from 'react';
import Button from './Button.js'
export default function AddTask({handleAddClick}) {
    const [text, setText] = useState('');
    return(
      <div id="add-task">
        <input id="add-input" type="text" onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddClick(text);
            setText('');
          }
        }} placeholder="new task" value={text}  onChange={(e)=>{
          setText(e.target.value);
        }}/>
        <Button btnText = "Add" disabled={text===''} onBtnClick={() => {
           handleAddClick(text);
           setText('');
          }}/>
      </div>
    )
  }