import React from 'react';

export default function CheckBox({checkId, handleCheck, disabled, checked, text}) {
    return(
      <label>
        <input type="checkbox" id={checkId} onChange={handleCheck} disabled={disabled} checked={checked} /><span>{text}</span>
      </label>
    )
}