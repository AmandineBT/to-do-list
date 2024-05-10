import Button from './Button.js'
export default function DeleteAllTasks({handleDeleteAllClick, noTasks}) {
    return(
      <>
        <Button btnText = "Delete Everything" disabled={noTasks} onBtnClick={handleDeleteAllClick}/>
      </>
    )
  }