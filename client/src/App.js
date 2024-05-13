import logo from './logo.svg';
import './App.css';
import {useQuery, gql} from "@apollo/client";

const query = gql`
  query GetAllTodos {
    getTodos {
        title
        completed
        userId
        user {
            name
            username
            email
        }
    }
  }
`;

function App() {
  const {data,loading} = useQuery(query);


  if(loading) return <h1>Loading....</h1>;



  return (
    <div className="App">
      <table>
        <tbody>
          {data.getTodos.map(todo => {
            return (
              <tr key={todo.id}>
                <td>{todo.title}</td>
                <td>{todo.user.name}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* {JSON.stringify(data)} */}
    </div>
  );
}

export default App;