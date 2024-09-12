/** @format */

import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div class='input-group mb-3'>
      <input
        type='text'
        class='form-control'
        placeholder="Search"
        aria-label="search"
        aria-describedby='button-addon2'
        value={searchTerm}
        onChange={handleChange}
      />
      <button
        class='btn btn-outline-success'
        type='button'
        id='button-addon2'
        onClick={handleSubmit}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
