/** @format */

import React, { useState } from "react";
import TicketModal from './TicketModal.js'; 
import "./SearchResultCard.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchResultCard = ({ ticket, onSelect }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  const handleClick = () => {
    onSelect(ticket);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="cart">
      <button type="bouton" onClick={handleClick} className="cart-button">
        <div className="contenu">
          <div className="par1">
            <h5 className="card-title">Internal ID: </h5>
            <p>{ticket[11]}</p>
            <h5 className="card-title">Agency Name: </h5>
            <p>{ticket[34]}</p>
          </div>
        </div>
      </button>
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={handleCloseModal}
        />
      )}

    </div>
  );
};

export default SearchResultCard;
