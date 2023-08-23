import logo from './logo.svg';
import './App.css';

import { gql, useSubscription } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client";


const CREATE_GAME = gql`
    mutation CreateGame {
      createGame {
        id
        state_id
        joinable
        players
      }
    }
  `;

// const UPDATED_HANDS = gql`
//     subscription OnUpdatedHand($id: ID!) {
//       updatedHand(id: $id) {
//         id
//         cards
//       }
//     }
  // `;
const UPDATED_HANDS = gql`
    subscription OnUpdatedHand {
      updatedHand(id: "64d48e5c-ab78-48c4-a907-250a5c84f5ab") {
        id
        cards
      }
    }
  `;

function MyComponent() {
  // const [createGame, { data }] = useMutation(CREATE_GAME);
  const hand_id = "64d48e5c-ab78-48c4-a907-250a5c84f5ab"
  const { data, loading } = useSubscription(
    UPDATED_HANDS, 
    { variables: { hand_id } }
  );

  if (data) {console.log(data)};
  // if (data) {console.log(data)};
  if (loading) return "data not fetched yet";
  // return <button onClick={createGame}>Click Me!</button>
  // return <h4>Fuck {data.updatedHand.id}</h4>;
  return (<ol>
      {data.updatedHand.cards.map(item => <li>{item}</li>)}
  </ol>)

}

export default function App() {
  return (
    <div>
      <h2>My first Apollo app 🚀</h2>
      {MyComponent()}
    </div>
  );
}