import React, {useState, useEffect} from 'react';
import Button from './Button.js';
import DragIndicator from '@mui/icons-material/DragIndicator';
import 'jquery';


const $ = require('jquery');
$.JqueryUI = require('jquery-ui-dist/jquery-ui.min.js');
$.sortable = require('jquery-ui/ui/widgets/sortable');
$.touchPunch = require('jquery-ui-touch-punch/jquery.ui.touch-punch.min.js');

const TaskListSortable = ({dndTasks,setDndTasks, sortChoice,notDoneOnly, tasksList, handleChangeClick, handleDeleteClick, handleCheckedChange}) => {
      
    
    const [isEditing, setIsEditing] = useState(false);
    const [modifiedTask, setModifiedTask] = useState([]);
    let sortedTasks= tasksList.slice();

    
    useEffect(() => {
      !isEditing && $("#add-input").focus();
    }, [isEditing]);
    // componentDidMount
    useEffect(() => {
        
        let dndSortedTasks= dndTasks.slice();

        function sortList(container)
        {
          var els = container.find('li');
          
          for (let i = 0; i < els.length; ++i) {
            let el = els[i];
            
            let p = parseInt(el.id);
            
            if (p !== -1) {
              dndSortedTasks= dndSortedTasks.map(function(t) 
              {
                if(parseInt(t.id) === p){
                  return {...t, pos : i+1}
                }
                 else {return t }
              });
            }
          }
          dndSortedTasks.sort(function compare(a, b) {
            if (a.pos < b.pos)
               return -1;
            if (a.pos > b.pos )
               return 1;
            return 0;
          });
          return dndSortedTasks;
        }
        
        $('#sortable').sortable({
          handle : '.handle',
          cursor : 'grabbing', 
          start: function( event, ui ) {$('#sort-choices').val('DragAndDrop');},
          update : function (){
            let sorted = sortList($('#sortable'));
            setDndTasks((d)=> sorted);
          }});
        //$("#sortable").disableSelection();
      }, [dndTasks, setDndTasks]);

      useEffect(()=> {
        localStorage.setItem("dndTasks", JSON.stringify(dndTasks));
      }, [dndTasks]);

     /* useEffect(() => {
        // componentWillUnmount
        return () => {
            $('#sortable').sortable().destroy();
        }
      }, []);*/
      
      function handlePressEnter(task){
        
          if(isEditing){
            handleChangeClick(modifiedTask);
          }
          else {
              setModifiedTask({id:task.id, text: task.text});
          }
          setIsEditing(!isEditing);
      }
      function taskLi(task ) {return (
        <li id={task.id ? task.id : 'error'} key={task.id ? task.date+task.id + task.text : 'error'} className="task" >
                    <span className='handle'>
                        <DragIndicator />
                       {/* 'task id : ' {task.id}*/}
                    </span>
                    <Task task={task} modifiedTask={modifiedTask} isEditing={isEditing} 
                        onTaskChange={(e)=> setModifiedTask({id:task.id, text: e.target.value})}
                        onCheckedChange={handleCheckedChange} onPressEnter={handlePressEnter}/>
                    <div className="buttons-container">
                      <Button onBtnClick={()=>
                          {
                          if(isEditing){
                              handleChangeClick(modifiedTask);
                          }
                          else {
                              setModifiedTask({id:task.id, text: task.text});
                          }
                          setIsEditing(!isEditing);
                          
                          }} 
                          btnText={modifiedTask.id === task.id && isEditing ? 'Save' : 'Edit' }/>
                      <span className="delete material-symbols-outlined" title="delete" onClick={()=>handleDeleteClick(task)} >
                          delete
                      </span>
                    </div>
        </li> 
    )};
    function taskUl(list){
      return(
        <ul id="sortable">
        {
          list.map((task)=>{ 
            return(
             taskLi(task)
            )
          })
        }
        </ul>
      )
    }

    if(sortChoice==='OlderFirst' && !notDoneOnly){ 
      sortedTasks.sort(function compare(a, b) {
        if (a.id < b.id)
           return -1;
        if (a.id > b.id )
           return 1;
        return 0;
      });
      
      
      return taskUl(sortedTasks);
      
    }
    else if(sortChoice==='NewerFirst' && !notDoneOnly){ 
      sortedTasks.sort(function compare(a, b) {
        if (a.id > b.id)
           return -1;
        if (a.id < b.id )
           return 1;
        return 0;
      });
      
      return taskUl(sortedTasks);
    }
    else if(sortChoice==='NotDoneFirst' && !notDoneOnly){ return(
      <ul id="sortable">
        {tasksList.map((task)=>{ 
          if(!task.done){ return(
              taskLi(task)
        )}
        else return ''
      })}
       {tasksList.map((task)=>{ 
          if(task.done){ return(
              taskLi(task)
        )}
        else return ''
      })}
      </ul>
    )}
    else if(sortChoice==='DoneFirst' && !notDoneOnly){ return(
      <ul id="sortable">
        {tasksList.map((task)=>{ 
          if(task.done){ return(
              taskLi(task)
          )}
          else return ''  
      })}
       {tasksList.map((task)=>{ 
          if(!task.done){ return(
              taskLi(task)
          )}
          else return ''
      })}
      </ul>
    )}
    else if(notDoneOnly){ return(
      <ul id="sortable">
        {tasksList.map((task)=>{ 
          if(!task.done){ return(
              taskLi(task)
          )}
          else return ''
        })}
      </ul>
    )}
    else if(sortChoice === 'DragAndDrop' && !notDoneOnly){
      return taskUl(dndTasks);
    }
    else{ return taskUl(tasksList);} 
}
function Task({task,modifiedTask, isEditing,onTaskChange, onCheckedChange, onPressEnter}){
    return(
        <>
          <label><input type="checkbox" name={task.text + '_' + task.id} checked={task.done} onChange={(e)=>onCheckedChange({...task, done: e.target.checked})} /></label>
          <label>
            {(modifiedTask.id === task.id && isEditing) ? 
            <input type="text" autoFocus placeholder={task.text} value={modifiedTask.text} onChange={onTaskChange} onKeyDown={(e) => {if (e.key === "Enter"){ onPressEnter(task)}}}
            /> 
        : 
            <span className='task-text'>{task.text} </span> }<br/><span className="date-added">task added on {task.date}</span> </label></>
    )
}
export default TaskListSortable;