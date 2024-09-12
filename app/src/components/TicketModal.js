/** @format */

import React from "react";

const TicketModal = ({ ticket, onClose }) => {
  return (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Ticket Details</h5>
            <button type="button" className="close" aria-label="Close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Internal ID: {ticket[11]}</p>
            <p>Event Number: {ticket[0]}</p>
            <p>Event version: {ticket[1]}</p>
            <p>Event Type: {ticket[2]}</p>
            <p>Issue Indicator: {ticket[15]}</p>
            <p>Transaction code: {ticket[16]}</p>
            <p>Transaction type: {ticket[17]}</p>
            <p>Event Type: {ticket[2]}</p>
            <p>Event Type: {ticket[2]}</p>
          </div>
          <div className="modal-footer">
            <button type='button' className='btn btn-secondary' onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;