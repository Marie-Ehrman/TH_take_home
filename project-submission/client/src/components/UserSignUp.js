import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Consumer } from './context'

const UserSignUp = (props) => {
    const [ user, setUser ] = useState({ 
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: ''
    });

    // create confirmPassword state to check against password state
    const [ confirmPassword, setConfirmPassword] = useState('');
    const [ validationMessages, setValidationMessages ] = useState([]);

    

    // function cancels page refresh and redirects to root url
    const handleCancel = (event) => {
        event.preventDefault();
        props.history.push('/');
    }

    // use React hooks to set state of user to values from form
    const handleUpdate = (event) => {
        const { name, value } = event.target;

        // if confirmPassword input is changing, set confirmPassword state; else set state of user
        if(name === 'confirmPassword') {
            setConfirmPassword(value);
        } else {
            setUser({ ...user, [name]: value });
        }
    }

    // render sign up form template
    return(
        <Consumer>
            { ({ action, errors }) => {
                // prevent page refresh and call function from context to sign in; pass in user object as parameter
                // call signIn action from context API; set error state if login unsuccessful else redirect to root url
                const handleSubmit = (event) => {
                    event.preventDefault();

                    // check if password matches confirmedPassword;
                        // call createUser action from context API if they match (will return empty array if user is created; else will send back array of errors);
                            // redirect to root directory if user is created
                            // if array of errors are returned, set validationMessages state to new array of errors
                        // else set validationErrors to message that password does not match
                    if(user.password === confirmPassword) {
                        action.createUser(user)
                            .then( errors => {
                                if(errors.length) {
                                    // create variable to build array of errors to pass to validationMessages
                                    let validationErrors = [];

                                    errors.map( error => {
                                        if( !validationMessages.find( validationMessage => validationMessage === error ) ) {
                                            validationErrors.push(error);
                                        }
                                    });
                                    setValidationMessages(validationErrors);
                                } else {
                                    {/* sign in after creating an account and redirect to home page */}
                                    action.signIn({ 
                                        emailAddress: user.emailAddress, 
                                        password: user.password
                                    } )
                                        .then( () => {
                                            props.history.push('/');
                                        })
                                        .catch( error => console.error('An error has occured signing in after signing up: ', error) );
                                }
                            })
                            .catch( error => console.log(error));
                    } else {
                            setValidationMessages([ 'Password does not match. Please re-enter the password' ]);
                    }
                }

                return(
                    <div className='bounds'>
                        {/* redirect to error page if there is an error from the Context API */}
                        { errors.length > 0 && <Redirect to='/error' /> }

                        {/* render sign up form */}
                        <div className='grid-33 centered signin'>
                            <h1>Sign Up</h1>

                            {/* display validation message if there are any */}
                            { validationMessages.length > 0 
                                && 
                                <div>
                                    <h2 className="validation--errors--label">Validation errors</h2>

                                    <div className='validation-errors'>
                                        <ul>
                                            {validationMessages.map( (validationMessage, index) => (
                                                    <li key={ index }>{ validationMessage }</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            }
    
                            {/* input value is set to state and state is updated to value on change */}
                            <form onSubmit={ handleSubmit }>
                                <div><input type='text' name='firstName' placeholder='First Name' value={ user.firstName } onChange={ handleUpdate } /></div>
                                <div><input type='text' name='lastName' placeholder='Last Name' value={ user.lastName } onChange={ handleUpdate } /></div>
                                <div><input type='text' name='emailAddress' placeholder='Email Address' value={ user.emailAddress } onChange={ handleUpdate } /></div>
                                <div><input type='password' name='password' placeholder='Password' value={ user.password } onChange={ handleUpdate } /></div>
                                <div><input type='password' name='confirmPassword' placeholder='Confirm Password' value={ confirmPassword } onChange={ handleUpdate } /></div>
                                <div className='grid-100 pad-bottom'>
                                <button className='button' type='submit'>SignUp</button>
                                    <button className='button button-secondary' onClick={ handleCancel }>Cancel</button>
                                </div>
                            </form>

                            <p>&nbsp;</p>
                            <p>Already have a user account? <Link to='/signin'>Click here</Link> to sign in!</p>
                        </div>
                    </div>
                );
            }}
        </Consumer>
    );
}

export default UserSignUp;