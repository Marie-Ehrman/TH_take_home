import React from 'react';
import { Link } from 'react-router-dom';
import { Consumer } from './context';
import '../stylesheets/styles.css';

// Nav Menu Component
const Header = () => {
    return(
        <Consumer>
            { ( { user }) => {
                return(
                    <div className='header'>
                        <div className='bounds'>
                            <h1 className='header--logo'>Courses</h1>
                            {/* 
                                conditional statement:
                                    display user welcome message if signed in 
                                    else display signup/sign in header 
                            */}

                            { user ? 
                                <nav>
                                    <span>Welcome { user.firstName } { user.lastName }!</span>
                                    <Link className='signout' to='/signout'>Sign Out</Link>
                                </nav>
                                    : 
                                <nav>
                                    <Link className='signup' to='/signup'>Sign Up</Link>
                                    <Link className='signin' to='/signin'>Sign In</Link>
                                </nav>
                            }
                        </div>
                    </div>
                );
            }}
        </Consumer>
    );
}

export default Header;