import { useEffect, useMemo, useRef, useState } from 'react';
import { SortBy, User } from './App.types';
import css from './App.module.css';
import UserList from './UserList';

const App = () => {
  const originalUsers = useRef<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isColored, setIsColored] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.None);
  const [searchedCountry, setSearchedCountry] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      fetch('https://randomuser.me/api/?results=100')
        .then((response) => response.json())
        .then((data) => {
          setUsers(data.results);
          originalUsers.current = data.results;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getUsers();
  }, []);

  const handleColorChange = () => {
    setIsColored(!isColored);
  };

  const handleSortByCountry = () => {
    if (sortBy === SortBy.Country) {
      setSortBy(SortBy.None);
    }

    if (sortBy === SortBy.None) {
      setSortBy(SortBy.Country);
    }
  };

  const handleReset = () => {
    setUsers(originalUsers.current);
  };

  const handleDeleteItem = (uuid: string) => {
    const newUsers = users.filter((user) => user.login.uuid !== uuid);
    setUsers(newUsers);
  };

  const handleSearchCountry = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedCountry(event.target.value);
  };

  const filteredUsers = useMemo(() => {
    if (searchedCountry.length === 0) {
      return users;
    }

    return users.filter((user) =>
      user.location.country
        .toLowerCase()
        .includes(searchedCountry.toLowerCase())
    );
  }, [searchedCountry, users]);

  const sortedUsers = useMemo(() => {
    const sortMap = {
      [SortBy.Name]: (user: User) => user.name.first,
      [SortBy.Lastname]: (user: User) => user.name.last,
      [SortBy.Country]: (user: User) => user.location.country,
      [SortBy.None]: () => '',
    };

    return filteredUsers.toSorted((a, b) => {
      const sortFn = sortMap[sortBy];
      return sortFn(a).localeCompare(sortFn(b));
    });
  }, [sortBy, filteredUsers]);

  const handleSort = (sortBy: SortBy) => {
    setSortBy(sortBy);
  };

  return (
    <div className={css.AppContainer}>
      <h1>Users list</h1>
      <div className={css.ButtonBar}>
        <button onClick={handleColorChange}>Color table</button>
        <button onClick={handleSortByCountry}>Sort By Country</button>
        <button onClick={handleReset}>Reset</button>
        <input
          type='text'
          placeholder='Search country'
          className={css.Input}
          onChange={handleSearchCountry}
        />
      </div>
      <UserList
        users={sortedUsers}
        isColored={isColored}
        handleSort={handleSort}
        handleDeleteItem={handleDeleteItem}
      />
    </div>
  );
};

export default App;
