import Button from './Button.js'
export default function DeleteSelected({handleDeleteSelected, noTasks}) {
    return(
      <>
        <Button btnText = "Delete every done task" disabled={noTasks} onBtnClick={handleDeleteSelected}/>
      </>
    )
  }