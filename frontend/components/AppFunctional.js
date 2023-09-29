import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default function AppFunctional(props) {
  const [state, setState] = useState({
        message: initialMessage,
        email: initialEmail,
        steps: initialSteps,
        index: initialIndex // the index the "B" is at
      });
        
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const getNextIndex = (direction) => {
    const { index } = state;

    switch (direction) {
      case 'up' :
        return index < 3 ? index : index - 3;
      case 'down' :
        return index > 5 ? index : index + 3;
      case 'right':
        return index === 2 || index === 5 || index === 8 ? index : index + 1;
      case 'left':
        return index === 0 || index === 3 || index === 6 ? index : index - 1;
      case 'reset':
        return initialIndex;
      default:
        return index;
    }
  }
  
  const getXY = () => {
    const index = state.index
    const x = (index % 3) + 1
    let y = null
    if (index < 3) {
      y = 1;
    } else if (index < 6) {
      y = 2;
    } else {
      y = 3;
    }
    return [x,y];
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }


  const getXYMessage = () => {
    const [x,y] = getXY()
      return `Coordinates (${x}, ${y})`
    }
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.

  const reset = () => {
    setState({ ...initialState });
    // Use this helper to reset all states to their initial values.
  }

  const move = (direction) => {
    const newIndex = getNextIndex(direction);
    if (newIndex !== state.index) {
      setState({
        message: '',
        index: newIndex,
        steps: state.steps + 1,
      });
    } else {
      switch (direction) {
        case 'up':
          setState({ ...state, message: "You can't go up" });
          break;
        case 'down':
          setState({ ...state, message: "You can't go down" });
          break;
        case 'right':
          setState({ ...state, message: "You can't go right" });
          break;
        case 'left':
          setState({ ...state, message: "You can't go left" });
          break;
        default:
          setState({ ...state, message: '' });
          break;
      }
    }
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  const onChange = (evt) => {
    setState({ ...state, email: evt.target.value })
    // You will need this to update the value of the input.
  }

  const onSubmit = evt => {
    evt.preventDefault();
    const [x,y] = getXY()
    const {email, steps} = state
    let message = null
    axios.post('http://localhost:9000/api/result', { x, y, steps, email } )
    .then(res => {
      message = res.data.message
    })
    .catch(err => {
      message = err.response.data.message
    })
    .finally(() => {
      setState({
        ...state,
        message,
        email: initialEmail,
      })
    })
    // Use a POST request to send a payload to the server.
  }

    return (
      <div id="wrapper" className={ props.className }>

        <div className="info">
          <h3 id="coordinates">{getXYMessage()}</h3>
          <h3 id="steps">You moved { state.steps } {`${state.steps === 1 ? 'time' : 'times'}`}</h3>
        </div>

        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square ${idx === state.index ? 'active' : ''}`}>
                {idx === state.index ? 'B' : null}
              </div>
            ))
          }
        </div>

        <div className="info">
          <h3 id="message">{state.message}</h3>
        </div>

        <div id="keypad">
          <button id="left"   onClick={() => move('left')}>  LEFT</button>
          <button id="up"     onClick={() => move('up')}>    UP</button>
          <button id="right"  onClick={() => move('right')}> RIGHT</button>
          <button id="down"   onClick={() => move('down')}>  DOWN</button>
          <button id="reset"  onClick={() => reset()}>       reset</button>
        </div>

        <form onSubmit={onSubmit}>
          <input id="email" type="email" value={state.email} onChange={onChange} placeholder="type email"></input>
          <input id="submit" type="submit" ></input>
        </form>

      </div>
    )
  }
