import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; 
import { Consumer } from './context'; // import Consumers Component from Context API
import '../stylesheets/styles.css';

const CourseDetail = (props) => {
    const [ deletingError, setDeletingError ] = useState();
    return(
        <Consumer>
            { ({ action, authenticatedUser, courses, errors, loading, user }) => {
                // assign id string query in URL to courseId
                const courseId = props.match.params.id;

                // use find() method to find courses from context using courseId
                const course = courses.find( course => course.id == courseId );

                // function to handle delete;
                    // calls deleteCourse function from context to delete course
                    // redirects to root route
                const handleDelete = () => {
                    if (authenticatedUser) {
                        action.deleteCourse(courseId, authenticatedUser);
                        props.history.push('/');
                    } else {
                        setDeletingError(['Please sign in to delete a course']);
                    }
                }

                // render Course Detail template if course is returned; else redirect to /notfound page 
                return(
                    <div>
                        {/* display loading status until API is fetched */}
                        { loading ? <p>Loading...</p> : (
                            <div>
                                {/* redirect to error page if there is an error from the Context API */}
                                { errors.length > 0 && <Redirect to='/error' /> }

                                {/* render course details */}
                                { course ? (
                                    <div>
                                        { authenticatedUser ? (
                                            <div>
                                                <div className='actions--bar'>
                                                    <div className='bounds'>
                                                        <div className='grid-100'>
                                                            {/* display Update and Delete button only if user owns course  */}
                                                            { user.id == course.user.id && 
                                                                <span>
                                                                    <Link className='button' to={ `/courses/${ props.match.params.id }/update` }>Update Course</Link>
                                                                    <button className='button' onClick={ handleDelete } >Delete Course</button>
                                                                </span>
                                                            }
                                                            <Link className='button button-secondary' to='/'>Return to List</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                            <div className='actions--bar'>
                                                    <div className='bounds'>
                                                        <div className='grid-100'>
                                                            <Link className='button button-secondary' to='/'>Return to List</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* display message if user is not signed in and is trying to delete a course */}
                                        { deletingError && 
                                            <div>
                                                <h2 className="validation--errors--label">Error</h2>
                                                <div className='validation-errors'>
                                                    <ul>
                                                        <li>{ deletingError }</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        }
                            
                                        <div className='bounds course--detail'>
                                            <div className='grid-66'>
                                                <div className='course--header'>
                                                    <h4 className='course--label'>Course</h4>
                                                    <h3 className='course--title'>{ course.title }</h3>
                                                    <p>{ course.user.firstName } { course.user.lastName }</p>
                                                </div>
                            
                                                <div className='course--description'>
                                                    <ReactMarkdown source={ course.description } />
                                                </div>
                                            </div>
                            
                                            <div className='grid-25 grid-right'>
                                                <div className='course--stats'>
                                                    <ul className='course--stats--list'>
                                                        <li className='course--stats--list--item'>
                                                            <h4>Estimated Time</h4>
                                                            <h3>{ course.estimatedTime }</h3>
                                                        </li>
                                                        <li className='course--stats--list--item'>
                                                            <h4>Materials Needed</h4>
                                                            <ul>
                                                                <ReactMarkdown source={ course.materialsNeeded }/>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                ) : 
                                <Redirect to='/notfound' />}

                            </div>
                        )}
                    </div>
                );
            }}
        </Consumer>
    );
}

export default CourseDetail;