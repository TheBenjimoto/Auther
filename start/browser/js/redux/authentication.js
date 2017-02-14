import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

const SET_CURRENT_USER = 'SET_CURRENT_USER';


/* ------------   ACTION CREATORS     ------------------ */


const setUser = user => ({ type: SET_CURRENT_USER, user })

/* ------------       REDUCER     ------------------ */

export default function reducer (currentUser = {}, action) {
  switch (action.type) {

    case SET_CURRENT_USER:
      return action.user 

    default:
      return currentUser;
  }
}


/* ------------       DISPATCHERS     ------------------ */

export const currentUser = users => dispatch => {
  console.log('current user has been hit')
  return axios.post('/login', users)
    .then(res => dispatch(setUser(res.data)))
    .catch(err => console.error(err));
}

export const signupUser = users => dispatch => {
  console.log('current user has been hit')
  return axios.post('/signup', users)
    .then(res => dispatch(setUser(res.data)))
    .catch(err => console.error(err));
}