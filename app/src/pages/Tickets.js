/** @format */

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../components/SearchBar.js";
import SearchResultCard from "../components/SearchResultCard.js";
import TicketModal from "../components/TicketModal.js";

const Tickets = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleSearch = async (searchTerm) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/search?searchTerm=${searchTerm}`
      );

      if (!response.ok) {
        throw new Error("Failed to search data");
      }

      const data = await response.json();
      console.log(data);
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching data:", error);
    }
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="container">
      <div className="row">
        <h1 className="mt-4 mb-4 col-lg-3 col-md-12">Ticket Search</h1>
        <div className="col">
        <div className="mt-4 mb-1 col">
          <SearchBar onSearch={handleSearch} />
        </div></div>
      </div>
      <div className="row mt-4">
        {searchResults.map((ticket, index) => (
          <div className="col" key={index}>
            <SearchResultCard ticket={ticket} onSelect={handleTicketSelect} />
          </div>
        ))}
      </div>
      {selectedTicket && (
        <TicketModal ticket={selectedTicket} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Tickets;
