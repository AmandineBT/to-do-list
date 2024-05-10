import React, {useState, useEffect} from 'react';
import Button from './Button.js';
import DragIndicator from '@mui/icons-material/DragIndicator';
import 'jquery';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const $ = require('jquery');

const TaskListSortable = ({noDndTasks, setNoDndTasks, dndTasks,setDndTasks, sortChoice,setSortChoice, notDoneOnly, tasksList, handleChangeClick, handleDeleteClick, handleCheckedChange}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [modifiedTask, setModifiedTask] = useState([]);
    let sortedTasks= tasksList.slice();

    /*useEffect(() => {
      !isEditing && $("#add-input").focus();
    }, [isEditing]);*/
    

    useEffect(()=> {
         localStorage.setItem("dndTasks", JSON.stringify(dndTasks));
    }, [dndTasks]);
    
    function handleOnDragEnd(result) {
        if (!result.destination) return;
       const items = Array.from(dndTasks);
       const [reorderedItem] = items.splice(result.source.index, 1);
       items.splice(result.destination.index, 0, reorderedItem);

       setDndTasks(items);
       $('#sort-choices').val('DragAndDrop');
       setSortChoice('DragAndDrop');
       if(noDndTasks) setNoDndTasks(false);
    }
   
    function handlePressEnter(task){
        
          if(isEditing){
            handleChangeClick(modifiedTask);
          }
          else {
              setModifiedTask({id:task.id, text: task.text});
          }
          setIsEditing(!isEditing);
    }

    function taskLi(task,index ) {return (
        <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
            {(provided) => (
                <li id={task.id.toString()}  className="task" ref={provided.innerRef} {...provided.draggableProps} >
                            <span className='handle' {...provided.dragHandleProps} title='drag and drop'>
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
            )}
        </Draggable>
    )};

    function taskUl(list){
      return(
        <DragAndDrop handleOnDragEnd={handleOnDragEnd}>
            {
                list.map((task, index)=>{ 
                    return(
                    taskLi(task, index)
                    )
                })
            }
        </DragAndDrop>
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
        <DragAndDrop handleOnDragEnd={handleOnDragEnd}>
            {tasksList.map((task, index)=>{ 
                if(!task.done){ return(
                    taskLi(task, index)
                )}
                else return ''
            })}
            {tasksList.map((task, index)=>{ 
                if(task.done){ return(
                    taskLi(task, index)
                )}
                else return ''
            })}
        </DragAndDrop>
    )}
    else if(sortChoice==='DoneFirst' && !notDoneOnly){ return(
        <DragAndDrop handleOnDragEnd={handleOnDragEnd}>
            {tasksList.map((task, index)=>{ 
                if(task.done){ return(
                    taskLi(task, index)
                )}
                else return ''  
            })}
            {tasksList.map((task, index)=>{ 
                if(!task.done){ return(
                    taskLi(task, index)
                )}
                else return ''
            })}
        </DragAndDrop>
    )}
    else if(notDoneOnly){ return(
        <DragAndDrop handleOnDragEnd={handleOnDragEnd}>
                            {tasksList.map((task, index)=>{ 
                            if(!task.done){ return(
                                taskLi(task, index)
                            )}
                            else return ''
                            })}
        </DragAndDrop>
    )}
    else if(sortChoice === 'DragAndDrop' && !notDoneOnly){
      return taskUl(dndTasks);
    }
    else{ return taskUl(tasksList);} 
}
function DragAndDrop({handleOnDragEnd,children}){
    return(
        <>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                          <ul id="sortable" {...provided.droppableProps} ref={provided.innerRef}>
                            {children}
                            {provided.placeholder}
                           </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    )
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