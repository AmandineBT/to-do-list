import {useState, useEffect} from 'react';
import TaskListSortable from './TaskListSortableV2.js';
import AddTask from './AddTask.js';
import DeleteAllTasks from './DeleteAllTasks.js';
import DeleteSelected from './DeleteSelected.js';
import Button from './Button.js';
import { confirmAlert } from 'react-confirm-alert'; //$ npm install react-confirm-alert --save
import 'react-confirm-alert/src/react-confirm-alert.css';
//import { CheckBox } from '@mui/icons-material';
import CheckBox from './Checkbox.js';




let sortChoiceVar='NewerFirst';

export default function ToDoList() {
    const [tasksList, setTasksList] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
    const [notDoneOnly, setNotDoneOnly] = useState(false);
    const [sortChoice, setSortChoice] = useState(localStorage.getItem('sortChoice') || 'NewerFirst');
    const [nextId, setNextId] = useState(parseInt(localStorage.getItem('nextId')) || 1);
    const [dndTasks, setDndTasks] = useState(JSON.parse(localStorage.getItem('dndTasks')) || []);
    const [checkAll, setCheckAll] = useState(false);
    const [noDndTasks, setNoDndTasks] = useState(true);

    useEffect(() => {
      localStorage.setItem("tasks", JSON.stringify(tasksList));
    }, [tasksList]);
    useEffect(()=> {
      localStorage.setItem("dndTasks", JSON.stringify(dndTasks));
    }, [dndTasks]);
    useEffect(() => {
      localStorage.setItem('nextId', nextId)
    }, [nextId]);
    useEffect(() => {
      localStorage.setItem("sortChoice", sortChoice);
    }, [sortChoice]);
    
    function handleAddClick(text) {
      if(text !==''){
        let now = new Date();
        let month = parseInt(now.getMonth()) + 1 ;
        let dateAddedString = now.getFullYear() + '/' + (month < 10 ? '0' + month : month)+ '/' + (now.getDate()<10 ? '0' + now.getDate() : now.getDate() ) + ' ' + (now.getHours()<10 ? '0' + now.getHours(): now.getHours())+ ':' + (now.getMinutes()<10 ? '0' + now.getMinutes() : now.getMinutes()) + ':' + (now.getSeconds()<10 ? '0' + now.getSeconds() : now.getSeconds());
        if(sortChoice !== 'NewerFirst') {
          setTasksList((t) => [
            ...tasksList, 
            {id: nextId,
            text: text, 
            done: false, 
            pos: tasksList.length + 1,
            date: dateAddedString,},
            ]);
        }
        else {
          setTasksList((t) => [ 
            {id: nextId,
            text: text, 
            done: false, 
            pos: tasksList.length + 1,
            date: dateAddedString,},
            ...tasksList,
            ]);
        }
        setDndTasks((d) => [
          {id: nextId,
          text: text, 
          done: false, 
          pos: dndTasks.length + 1,
          date: dateAddedString,},
          ...dndTasks, 
        ]);
        setNextId((n)=> nextId + 1);
      }
    }
    function handleDeleteAllClick(){
      confirmAlert({
        title: 'Confirm to delete all tasks',
        message: 'Do you really want to delete all tasks ?',
        buttons: [
          {
            label: 'Yes, delete everything',
            onClick: () => {
              setTasksList((t) => []);
              setDndTasks((d)=>[]);
              setNextId(1);
              setSortChoice((s)=> "NewerFirst");
            }
          },
          {
            label: 'Cancel',
            onClick: () => {return}
          }
        ]
      });
    }
    function handleDeleteSelected(){
      confirmAlert({
        title: 'Confirm to delete all selected tasks',
        message: 'Do you really want to delete all checked tasks ?',
        buttons: [
          {
            label: 'Yes, delete every done task',
            onClick: () => {
              setTasksList(tasksList.filter((task) => task.done !==true));
              setDndTasks(dndTasks.filter((task)=> task.done !== true ));
            }
          },
          {
            label: 'Cancel',
            onClick: () => {return}
          }
        ]
      });
    }
    function handleChangeClick(modified) {
          setTasksList(tasksList.map((t)=> 
          {
            if(t.id === modified.id) return{...t, text: modified.text };
            else return t;
          }
          ));
          setDndTasks(dndTasks.map((t)=> 
          {
            if(t.id === modified.id) return{...t, text: modified.text };
            else return t;
          }
          ));
    }
    function handleDeleteClick(task) {
      confirmAlert({
        title: 'Confirm to delete this task',
        message: "Do you really want to delete this task ( \"" + task.text + "\" )? ",
        buttons: [
          {
            label: 'Yes, delete this task',
            onClick: () => {
              setTasksList(tasksList.filter((t) => t.id !== task.id));
              setDndTasks(dndTasks.filter((t) => t.id !== task.id));
            }
          },
          {
            label: 'Cancel',
            onClick: () => {return}
          }
        ]
      });
    }
    function handleCheckedChange(task) {
      setTasksList(tasksList.map((t)=> 
          {
            if(parseInt(t.id) === parseInt(task.id)) return{...t, done: task.done };
            else return t;
          }
          ));
      setDndTasks(dndTasks.map((t)=> 
          {
            if(parseInt(t.id) === parseInt(task.id)) return{...t, done: task.done };
            else return t;
          }
          ));
    }
    function handleSortChange(sortChoiceVar){
      setSortChoice((s)=> sortChoiceVar);
    }
    
    function allDone(tasksList){
      if ((tasksList.filter((task) => (task.done)).length) === tasksList.length ) return true
      else return false
    }
    function zeroDone(tasksList){
      if ((tasksList.filter((task) => (!task.done)).length) === tasksList.length ) return true
      else return false
    }
    function handleCheckAll() {
      setCheckAll(c=> !checkAll);
      setTasksList(tasksList.map((task)=> { return {...task, done: !checkAll}}));
      setDndTasks(dndTasks.map((task)=> { return {...task, done: !checkAll}}));
    }

    return(
      <>
        <div id="actions">
          <SortList noDndTasks={noDndTasks} setNoDndTasks={setNoDndTasks} onSortListChange={handleSortChange} disabled={notDoneOnly || tasksList.length === 0} allDone = {allDone(tasksList)} zeroDone = {zeroDone(tasksList)} sortChoice={sortChoice} />
          <Button btnText={!notDoneOnly ? "Not done only" : "All" } disabled = {allDone(tasksList) || zeroDone(tasksList)} onBtnClick={() => setNotDoneOnly(!notDoneOnly)} />
          <AddTask handleAddClick={handleAddClick} />
          <DeleteAllTasks handleDeleteAllClick={handleDeleteAllClick} noTasks={tasksList.length === 0}/>
          <DeleteSelected handleDeleteSelected={handleDeleteSelected} noTasks={tasksList.length === 0 || zeroDone(tasksList)} /> 
          <br/><CheckBox checkId="check-all" checked={allDone(tasksList)} handleCheck={handleCheckAll} disabled={tasksList.lentgh === 0} text="check/uncheck every task" />
        </div>
        <TaskListSortable noDndTasks={noDndTasks} setNoDndTasks={setNoDndTasks} dndTasks={dndTasks} setDndTasks={setDndTasks} sortChoice={sortChoice} setSortChoice={setSortChoice} notDoneOnly={notDoneOnly} tasksList={tasksList} handleChangeClick={handleChangeClick} handleDeleteClick={handleDeleteClick} handleCheckedChange={handleCheckedChange}/>
      </>
      
    );
  }
function SortList({noDndTasks, onSortListChange, disabled, sortChoice, allDone, zeroDone}){
  return(
     <>
      <label>Sort
        <select disabled={disabled} name="sort-choices" id="sort-choices" defaultValue={sortChoice} onChange={(e)=> {sortChoiceVar=e.target.value;onSortListChange(sortChoiceVar);}}>
          <option value='NewerFirst'>Newer first</option>
          <option value='OlderFirst'>Older first</option>
          <option value='DragAndDrop' disabled={noDndTasks}>Dragged and dropped</option>
          <option value='NotDoneFirst' disabled={allDone || zeroDone}>Not done first</option>
          <option value='DoneFirst'disabled={allDone || zeroDone} >Done first</option>
        </select>
      </label>
     </>  
  )
}