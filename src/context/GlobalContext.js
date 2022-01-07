import React, { useState, useEffect, createContext } from 'react'

const GlobalContext = createContext()

const GlobalProvider = (props) => {
  const [games, setGames] = useState([])
  const [gamenights, setGameNights] = useState([])

  const fetchGames = async () => {
    try {
      const gameData = await fetch('https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false&client_id=DSHOCsJGeA')
      const { games } = await gameData.json()
      setGames(games.map(game => {
        return {
          id: game.id,
          name: game.name,
          price: game.price, 
          min_players: game.min_players, 
          max_players: game.max_players,
          img: game.thumb_url
        }
      }).sort((a, b) => {
        return a.name.localeCompare(b.name)
      }))
    } catch (e) {
        console.log(e.message)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  const addGameNight = (newGameNight) => {
    setGameNights([...gamenights, newGameNight])
  }

  const addWinner = (newWinner) => {
    const currentGameNight = gamenights.find(gamenight => gamenight.id === newWinner.id)
    const otherGameNights = gamenights.filter(gamenight => gamenight.id !== newWinner.id)
    currentGameNight.gamesPlayed.push(newWinner)
    setGameNights([...otherGameNights, currentGameNight])
  }

  return (
      <GlobalContext.Provider value={{games, gamenights, addGameNight, addWinner}}>
        {props.children}
      </GlobalContext.Provider>
    )
}

export {GlobalContext, GlobalProvider}

