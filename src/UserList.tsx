import { SortBy, User } from './App.types';
import css from './App.module.css';
import userListCss from './UserList.module.css';

interface UserListProps {
  users: User[];
  isColored: boolean;
  handleSort: (sortBy: SortBy) => void;
  handleDeleteItem: (uuid: string) => void;
}

const UserList = ({
  users,
  isColored,
  handleDeleteItem,
  handleSort,
}: UserListProps) => {
  return (
    <table className={userListCss.Table}>
      <thead>
        <tr>
          <th>Avatar</th>
          <th onClick={() => handleSort(SortBy.Name)} className={css.Sortable}>
            Name
          </th>
          <th
            onClick={() => handleSort(SortBy.Lastname)}
            className={css.Sortable}>
            Lastname
          </th>
          <th
            onClick={() => handleSort(SortBy.Country)}
            className={css.Sortable}>
            Country
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => {
          const rowClass = index % 2 === 0 ? css.Even : css.Odd;
          const finalRowClass = isColored ? rowClass : '';

          return (
            <tr key={user.login.uuid} className={finalRowClass}>
              <td>
                <img src={user.picture.thumbnail} alt='user' />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => handleDeleteItem(user.login.uuid)}>
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UserList;
