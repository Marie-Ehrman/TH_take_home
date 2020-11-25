import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Consumer } from '../components/context';

function UserSignIn(props) {
    const [ user, setUser ] = useState({ emailAddress: 'joe@smith.com', password: 'joepassword' });
    const [ error, setError ] = useState();
    // set from variable to redirect to location from previous route or root URL
    const { from } = props.location.state || { from: { pathname: '/' } }

    // function cancels page refresh and redirects to root url
    const handleCancel = (event) => {
        event.preventDefault();
        props.history.push('/');
    }

    // use React hooks to set state of user to values from form
    const handleUpdate = (event) => {
        const { name, value } = event.target;   
        setUser({ ...user, [name]: value });
    }

    // render form sign in template
    return(
        <Consumer>   
            { ({ action, errors }) => {
                // prevent page refresh and call function from context to sign in; pass in user object as parameter
                // call signIn action from context API; set error state if login unsuccessful else redirect to root url
                const handleSubmit = (event) => {
                    event.preventDefault();
                    action.signIn(user)
                        .then( user => {
                            if( user === null ) {
                                setError('Sign-In was unsuccessful. Email Address or password does not match.');
                            } else {
                                props.history.push(from); // redirect location from 'from' variable
                            }
                        });
                }
                           
                return(
                    <div className='bounds'>
                        {/* redirect to error page if there is an error from the Context API */}
                        { errors.length > 0 && <Redirect to='/error' /> }

                        {/* render sign in form */}
                        <div className='grid-33 centered signin'>
                            <h1>Sign In</h1>
                            {/* display unsuccessful login message if user GET route is not successful */}
                            { error && 
                            <div>
                                <h2 className="validation--errors--label">Validation errors</h2>
                                
                                <div className='validation-errors'>
                                    <ul>
                                        <li>{ error }</li>
                                    </ul>
                                </div>
                            </div> }
                                
                            <div>
                                <form onSubmit={ handleSubmit } >
                                    {/* set value equel to state and update state on change */}
                                    <div><input type='text' id='emailAddress' name='emailAddress' placeholder='Email Address' value={ user.emailAddress } onChange={ handleUpdate } /></div>
                                    <div><input type='password' id='password' name='password' placeholder='Password' value={ user.password } onChange={ handleUpdate } /></div>
                                    <div className='grid-100 pad-bottom'>
                                        <button className='button' type='submit'>Sign In</button>
                                        {/* button onclick calls handleCancel function */}
                                        <button className='button button-secondary' onClick={ handleCancel } >Cancel</button>
                                    </div>
                                </form>
                            </div>

                            <p>&nbsp;</p>
                            <p>Don't have a user account? <Link to='/signup'>Click here</Link> to sign up!</p>                        
                        </div>
                    </div>
                );
            }}
        </Consumer>
    );
}

export default UserSignIn;