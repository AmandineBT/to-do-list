
export default function Button({btnText, onBtnClick, disabled}){  return(
    <button onClick={onBtnClick} disabled={disabled} className={btnText.toLowerCase().replaceAll(' ', '-')}>{btnText}</button>
  )
}