import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";


const Sweet = ({ sweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newSweet, setNewSweet] = useState(sweetObj.text);
  /* -------------------------------- */
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this sweet?");
    if (ok) {
      await dbService.doc(`sweets/${sweetObj.id}`).delete();
      await storageService.refFromURL(sweetObj.attachmentUrl).delete();
    }
  };
  /* -------------------------------- */
  const toggleEditing = () => setEditing((prev) => !prev);
  /* -------------------------------- */
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`sweets/${sweetObj.id}`).update({
      text: newSweet,
    });
    setEditing(false);
  };
  /* -------------------------------- */
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewSweet(value);
  };
  /* -------------------------------- */
  return (
    <div className="sweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container sweetEdit">
            <input
              type="text"
              placeholder="Edit your sweet"
              value={newSweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update Sweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
        <div className="sweet_box">
          
            <div className="sweet_text">
            <h4>{sweetObj.text}</h4>
            </div>
            <div className="sweet_img">
            {sweetObj.attachmentUrl && 
            <img src={sweetObj.attachmentUrl} alt="img" />}
            </div>
          
          {isOwner && (
            <div className="sweet__actions">
              <div className="sweet_username">
                {sweetObj.creatorName} 
                {Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(sweetObj.createdAt)}
                </div>    
              <div className="sweet_delete" onClick={onDeleteClick} title="delete">
                <FontAwesomeIcon icon={faTrash} />
              </div>
              <div className="sweet_edit" onClick={toggleEditing} title="edit">
                <FontAwesomeIcon icon={faPencilAlt} />
              </div>
            </div>
          )}
          {isOwner ? <span></span> :
          <span className="sweet_username">
            {sweetObj.creatorName} 
            {Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(sweetObj.createdAt)}
            </span>
          }
          </div>
        </>
      )}
    </div>
  );
};

export default Sweet;