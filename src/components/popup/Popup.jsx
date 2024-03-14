
import "./Popup.css"
const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
  

    return (
      <div className="popup-container">
        <div className="popup">
          <p>{message}</p>
          <div className="popup-buttons">
            <button onClick={onCancel} className="btn btn-primary">Cancel</button>
            <button data-dismiss="modal"
                         aria-label="Close"
                         className="btn btn-primary"
                         onClick={onConfirm}>OK</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationPopup;