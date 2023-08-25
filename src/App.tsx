import React, { MouseEventHandler, useState } from 'react';
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

const JOIN_GAME = gql`
    mutation JoinGame($game_id: ID!, $player_name: String!) {
      joinGame(game_id: $game_id, player_name: $player_name) {
        id
        name
        game_id
        hand_id
        rank
        has_passed
      }
    }
  `;

const START_GAME = gql`
  mutation StartGame($game_id: String!){
    startGame(game_id: $game_id){
      id
      game_id
      active_player_idx
      active_player_id
      last_played_idx
      top_of_pile
      pot_size
      revolution
      direction
      active_pattern
    }
  }
`


const UPDATED_HANDS = gql`
    subscription OnUpdatedHand($hand_id: ID!) {
      updatedHand(id: $hand_id) {
        id
        cards
      }
    }
  `;


const UPDATED_STATE = gql`
  subscription OnUpdatedState($game_id: ID!) {
      updatedState(game_id: $game_id) {
        id
        game_id
        active_player_idx
        active_player_id
        last_played_idx
        top_of_pile
        pot_size
        revolution
        direction
        active_pattern
      }
    }
`



function createGameButton(
  gameId: string, 
  setGameId: React.Dispatch<React.SetStateAction<string>>,
){
  const [ createGameMutation, { data, loading } ] = useMutation(CREATE_GAME, {
    onCompleted: (data) => {
      setGameId(data.createGame.id)
    },
    onError: (error) => console.error("Error creating game", error),
  });
  // console.log('here')

  if (gameId !== '') return <p>{gameId}</p>
  if (data) {
    // setNewGame(true)
    return <p>{data.createGame.id}</p>
  }
  if (loading) return <p>Creating Game</p>

  return <button onClick={createGameMutation as MouseEventHandler}>Create Game</button>
}


function joinGameButton(
  gameId: string, 
  setGameId: React.Dispatch<React.SetStateAction<string>>,
  playerName: string, 
  setPlayerName: React.Dispatch<React.SetStateAction<string>>,
  setPlayerId: React.Dispatch<React.SetStateAction<string>>, 
  setHandId: React.Dispatch<React.SetStateAction<string>>, 
){
  const [ joinGameMutation, { data, loading }] = useMutation(JOIN_GAME, {
    onCompleted: (data) => {
      setHandId(data.joinGame.hand_id)
      setPlayerId(data.joinGame.player_id)
    },
    onError: (error) => console.error("Error joining game", error),
  });

  const useJoinGameMutation = () => {
    joinGameMutation({ variables: { game_id: gameId, player_name: playerName } })
  }

  function onGameIDChange(event: React.FormEvent<HTMLInputElement>) {
    setGameId(event.currentTarget.value)
  }

  function onPlayerNameChange(event: React.FormEvent<HTMLInputElement>) {
    setPlayerName(event.currentTarget.value)
  }

  if (data) return <p></p> 
  if (loading) return <p>Joining Game</p>
  // if (gameId) return
  
  // return <button onClick={useJoinGameMutation as MouseEventHandler}>Join Game</button>

  return (
    <div>
      <button onClick={useJoinGameMutation as MouseEventHandler}>Join Game</button>
      <label>Game ID: <input name="gameIdInput" onChange={onGameIDChange}/></label>
      <label>Name: <input name="playerNameInput" onChange={onPlayerNameChange}/></label>
    </div>
  )
}


function startGameButton(gameId: string){
  const [ startGameMutation, { data, loading } ] = useMutation(START_GAME, {
    // onCompleted: (data) => stateIdReactiveVar(data.startGame.id),
    onError: (error) => console.error("Error starting game", error),
  });

  const useStartGameMutation = () => {
    startGameMutation({ variables: { game_id: gameId } })
  }

  if (data) return <p>{data.startGame.id}</p>
  if (loading) return <p>Starting Game</p>

  if (gameId) return <button onClick={useStartGameMutation as MouseEventHandler}>Start Game</button>

  return <p></p>
}


function handSubscription(handId: string){
  const { data } = useSubscription(UPDATED_HANDS, {
    onData: (data) => console.log(data),
    variables: { hand_id: handId },
    shouldResubscribe: true,
    // skip: true
  });

  if (data) {
    return (<ol>
        {data.updatedHand.cards.map((item: string) => <li>{item}</li>)}
    </ol>)
  }
}

function stateSubscription(
  gameId: string,
){
  const { data } = useSubscription(UPDATED_STATE, {
    onData: (data) => console.log(data),
    variables: { game_id: gameId },
    shouldResubscribe: true,
    // skip: true
  });

  if (data) {
    // setShowStartGame(false)

    return (<ol>
        <li>active_pattern: {data.updatedState.active_pattern}</li>
        <li>active_player_id: {data.updatedState.active_player_id}</li>
        <li>active_player_idx: {data.updatedState.active_player_idx}</li>
        <li>direction: {data.updatedState.direction}</li>
        <li>game_id: {data.updatedState.game_id}</li>
        <li>id: {data.updatedState.id}</li>
        <li>last_played_idx: {data.updatedState.last_played_idx}</li>
        <li>pot_size: {data.updatedState.pot_size}</li>
        <li>revolution: {data.updatedState.revolution}</li>
        top_of_pile: {data.updatedState.top_of_pile.map((item: string) => <li>{item}</li>)}
    </ol>)
  }
}




export default function App() {

  // const handIdVar: ReactiveVar<string> = makeVar<string>("");
  // const gameIdVar: ReactiveVar<string> = makeVar<string>("");
  const [gameId, setGameId] = useState("")
  const [handId, setHandId] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [, setPlayerId] = useState("")

  return (
    <div>
      {createGameButton(gameId, setGameId)}
      {joinGameButton(gameId, setGameId, playerName, setPlayerName, setPlayerId, setHandId)}
      {startGameButton(gameId)}
      {handSubscription(handId)}
      {stateSubscription(gameId)}
    </div>
  );
}
