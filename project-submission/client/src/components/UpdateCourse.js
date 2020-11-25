import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Consumer } from './context';

const UpdateCourse = (props) => {
    // set states with React hooks
    const [ updatedCourse, setUpdatedCourse ] = useState();
    const [ validationErrors, setValidationErrors ] = useState([]);

    // Cancel button returns to Course Details 
    const handleCancel = (event) => {
        event.preventDefault();
        props.history.goBack();
    }


    return(
        <Consumer>
            { ({ action, authenticatedUser, courses, errors, loading, user }) => {
                // find current course with course id in URL
                const courseId = props.match.params.id;
                // eslint-disable-next-line
                let currentCourse = courses.find( course => course.id == courseId );

                // update updatedCourse state when values on form changes         
                const handleUpdate = (event) => {
                    const { name, value } = event.target;

                    // if updatedCourse state is null, set to currentCourse
                    if(!updatedCourse) {
                        setUpdatedCourse({...currentCourse, [name]: value });
                    } else {
                        setUpdatedCourse({ ...updatedCourse, [name]: value });
                    }
                }
                
                // submit PUT request to update course
                    // check if user is authenticated
                    // check if any changes was made 
                const handleSubmit = (event) => {
                    event.preventDefault();
               
                    if(authenticatedUser) {
                        if(!updatedCourse) {
                            setValidationErrors('No changes has been made. Course was not updated');
                        } else {
                            //  cation updateCourse function from context and pass course Id, updated course and user authentication
                            action.updateCourse(courseId, updatedCourse, authenticatedUser)
                            .then( errors => {
                                    //if array of errors are returned, set validationErrors array of validation errors
                                    if(errors) {
                                        // create variable to build array of errors to pass to validationMessages
                                        let apiValidationErrors = [];
                                        // eslint-disable-next-line
                                        errors.map( error => {
                                            apiValidationErrors.push(error);
                                        });
                                        setValidationErrors(apiValidationErrors);
                                    } else {
                                        props.history.push(`/courses/${courseId}`);
                                    }
                                })
                                .catch( error => console.log(error));
                        }
                    } 
                }

                return(
                    <div>
                        { loading ? <p>Loading...</p> : (
                            <div>
                                {/* redirect to error page if there is an error from the Context API */}
                                { errors.length > 0 && <Redirect to='/error' /> }

                                <div className='bounds course--detail'>
                                    {/* render course update form */}
                                    { currentCourse ? (
                                            <div>
                                            
                                                { // eslint-disable-next-line
                                                    user.id == currentCourse.user.id ? (
                                                    <div>
                                                        <h1>Update Course</h1>

                                                        {/* display if there is an error message */}
                                                        { validationErrors.length > 0 && 
                                                            <div>
                                                                <h2 className="validation--errors--label">Validation errors</h2>
                                                                <div className='validation-errors'>
                                                                    <ul>
                                                                    { validationErrors.map( (errorMessage, i) => (
                                                                        <li key={i}>{ errorMessage }</li>
                                                                    ) ) }                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        }

                                                        <div>
                                                            <form onSubmit={ handleSubmit } >
                                                                <div className='grid-66'>
                                                                    <div className='course--header'>
                                                                        <h4 className='course--label'>Course</h4>

                                                                        <div><input 
                                                                            className='input-title course--title--input' 
                                                                            type='text' 
                                                                            name='title' 
                                                                            placeholder='title'
                                                                            defaultValue={ currentCourse.title }
                                                                            onChange={ handleUpdate }
                                                                        /></div>
                                                                        <p>By { user.firstName } { user.lastName }</p>
                                                                    </div>

                                                                    <div className='course--description'>
                                                                        <div><textarea name='description' placeholder='Course description...' defaultValue={ currentCourse.description } onChange={ handleUpdate } ></textarea></div>
                                                                    </div>
                                                                </div>       

                                                                <div className='grid-25 grid-right'>
                                                                    <div className='course--stats'>
                                                                        <ul className='course--stats--list'>
                                                                            <li className='course--stats--list--item'>
                                                                                <h4>Estimated Time</h4>
                                                                                <div><input 
                                                                                    className='course--time--input' 
                                                                                    type='text' 
                                                                                    name='estimatedTime'
                                                                                    placeholder='Estimated time'
                                                                                    defaultValue={ currentCourse.estimatedTime }
                                                                                    onChange={ handleUpdate } 
                                                                                /></div>
                                                                            </li>
                                                                            <li className='course--stats--list--item'>
                                                                                <h4>Materials Needed</h4>
                                                                                <div><textarea name='materialsNeeded' placeholder='List materials...' defaultValue={ currentCourse.materialsNeeded } onChange={ handleUpdate } ></textarea></div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div> 

                                                                <div className='grid-100 pad-bottom'>
                                                                    <button className='button' type='submit'>Update Course</button>
                                                                    <button className='button button-secondary' onClick={ handleCancel } >Cancel</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                ) : <Redirect to='/forbidden' />}
                                            </div>
                                    ) : <Redirect to='/notfound' />}
                                </div>

                            </div>
                        )}
                    </div>
                );
            }}
        </Consumer>
    );
}

export default UpdateCourse;