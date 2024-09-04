import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [startgame,setStartgame] = React.useState(false)
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [selected, setSelected] = React.useState(false)
    const [count, setcount] = React.useState(0)
    const [seconds, setSeconds]= React.useState(0)
    
    
    React.useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalId);   

  }, []);
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        setSelected(dice.every(die => die.isHeld))
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
         setcount(prev=>prev =prev +1)
        if(!selected) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setcount(0)
            setSeconds(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? {id:die.id,value:die.value, isHeld: !die.isHeld } : die;
          }));
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    function start(){
        setStartgame(true)
    }
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            
         { startgame?<div className="style">
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies || selected ? "New Game" : "Roll"}
            </button>
            <p className="count">Roll Count: {count}</p>
            <p className="time">Time: {seconds}</p>
            </div>:<button className="start-btn" onClick={start}> Start Game</button>}
            
        </main>
    )
}