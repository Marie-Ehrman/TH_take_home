import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom'; 
import { Consumer } from './context'; // import Consumer component to subscribe to Context API
import axios from 'axios';
import '../stylesheets/styles.css'; 

function Courses() {
    const [ loading, setLoading ] = useState(true);
    const [ courses, setCourses] = useState([]);
    const [ errors, setErrors ] = useState([]);


    useEffect( () => {
        fetchCourses();
    }, [loading]); 

    // function to fetch API 
        // use axios to fetch api and set courses state using React hooks
    const fetchCourses = async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/courses');
            setCourses(response.data.courses);

            if(courses) {
                setLoading(false);
            } else {
                setLoading(true);
            }
        } catch(error) {
            console.error('Unsuccessful retrieving list of courses: ', error);
            setErrors([ ...errors, error]);
        }
    }


    return(
        <div>
            {/* 
                subscribe to Context API with Consumer component 
                    - deconstruct courses from context 
                    - map over courses and create list of courses 
            */}
            <Consumer>
                { ({}) => {
                    return(
                        <div>
                            {/* redirect to error page if there is an error from the Context API */}
                            { errors.length > 0 && <Redirect to='/error' />}
                            
                            <div className='bounds'>
                                {/* render loading if course list is not loaded; else render course list */}
                                { loading ? <p>Loading...</p> : (
                                    <div>
                                        {/* render list of courses */}
                                        { courses.map( course => (
                                            <div key={ course.id } className='grid-33'><Link className='course--module course--link' to={ `/courses/${course.id}` }>
                                                <h4 className='course--label'>Course</h4>
                                                <h3 className='course--title'>{ course.title }</h3>
                                            </Link></div>
                                        )) }
                                          
                                        {/* create new course button */}
                                        <div className='grid-33'><Link className='course--module course--add--module' to='/courses/create'>
                                        <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                                viewBox="0 0 13 13" className="add">
                                                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                                            </svg>New Course</h3>
                                        </Link></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }}
            </Consumer>
        </div>
    );
}

export default Courses;