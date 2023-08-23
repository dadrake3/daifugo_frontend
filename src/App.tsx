import { MouseEventHandler } from 'react';
import './App.css'

import { gql, useSubscription, useMutation } from "@apollo/client";


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


const UPDATED_HANDS = gql`
    subscription OnUpdatedHand($hand_id: ID!) {
      updatedHand(id: $hand_id) {
        id
        cards
      }
    }
  `;

function HandComponent(hand_id: string) {
  // 
  const { data, loading, error } = useSubscription(
    UPDATED_HANDS, 
    { variables: { hand_id: hand_id } }
  );

  if (data) {console.log(data)};
  if (loading) return "data not fetched yet";
  if (error) return <p>{error.message}</p>;

  return (<ol>
      {data.updatedHand.cards.map((item: string) => <li>{item}</li>)}
  </ol>)
};

function StartGameButton() {
  const [createGame, { data, loading, error }] = useMutation(
    CREATE_GAME, 
  );
  if (data){return <p>Game ID: {data.createGame.id}</p>;}
  if (loading) return "data not fetched yet";
  if (error) return <p>{error.message}</p>;

  return <button onClick={createGame as MouseEventHandler}>Start Game</button>
};

export default function App() {
  return (
    <div>
      <h2>My first Apollo app 🚀</h2>
      {HandComponent("b802169b-8463-4c94-8a53-22dfd64addb4")}
      {StartGameButton()}
    </div>
  );
}
