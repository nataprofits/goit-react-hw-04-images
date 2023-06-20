import { useState } from 'react';
import PropTypes from 'prop-types';
import { GoSearch } from 'react-icons/go';
import { toast } from 'react-toastify';
import { Header, SearchForm, Button, Input } from './Searchbar.styled';

const Searchbar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = e => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (!query.trim() === '') {
      toast.error('Search field is empty! Please enter a search word.');
      return;
    }
    onSubmit(query);
  };

  return (
    <Header>
      <SearchForm onSubmit={handleSearchSubmit}>
        <Button type="submit">
          <GoSearch size="20" />
          <span>Search</span>
        </Button>

        <Input
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={query}
          onChange={handleInputChange}
        />
      </SearchForm>
    </Header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
export default Searchbar;
