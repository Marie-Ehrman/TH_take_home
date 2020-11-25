import React, { createContext, useEffect, useState } from 'react'; 
import axios from 'axios';
import Cookies from 'js-cookie'; // import JavaScript Cookie library

// create Course Context to be consumed by components
export const CourseContext = createContext();

// Create HOC Provider component to allow children components to consume context
export const Provider = (props) => {
    const [ loading, setLoading ] = useState(true);
    // set states using React hooks
    const [courses, setCourses] = useState([]);

    // set authenticatedUser.user to cookie or null
    const [ authenticatedUser, setAuthenticatedUser ] = useState( Cookies.getJSON('encodedCredentials') || null );
    const [ user, setUser ] = useState( Cookies.getJSON('authenticatedUser') || null );

    const [ errors, setErrors ] = useState([]);

    // useEffect function to execute fechAPI function when the component is mounted
    useEffect( () => {
        fetchAPI();
        // eslint-disable-next-line
    }, [loading]); 

    // function to fetch API 
        // use axios to fetch api and set courses state using React hooks
    const fetchAPI = async() => {
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

    // GET request to /api/users to users; return user if credentials matches
    const signIn = async(user) => {
        // encode emailaddress and passsword passed from parameter
        const encodedCredentials = btoa(`${ user.emailAddress }:${ user.password }`); 

        // create options object to pass as header in GET method
            // passes encoded credentials as basic authorization
        const options = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: `Basic ${ encodedCredentials }`
              },
        };
        
        // make API fetch to users GET route and pass options as 2nd parameter
            // if successful, return user; else return null;
        try {
            const response = await axios.get('http://localhost:5000/api/users', options);
            const currentUser = response.data.user;
            currentUser.password = user.password;
            // set authenticatedUser and user state
            setAuthenticatedUser(encodedCredentials);
            setUser(currentUser);
            
            // Set Cookie to store signed in user and encodedCredentials
            // first arguement is the name of the cookie to set
            // second arguement is the value to store (store stringified user object)
            // third arguement sets when the cookie expires
            Cookies.set('authenticatedUser', JSON.stringify(currentUser), { expires: 1 });
            Cookies.set('encodedCredentials', JSON.stringify(encodedCredentials), { expires: 1 })

            return currentUser;
        } catch(error) {
            if(error.response.status === 401) {
                console.error('Login was unauthorized: ', error);
                return null;
            } else {
                setErrors([ ...errors, error]);
            }
        }
    }

    // POST request to /api/users to add new user
    const createUser = async(user) => {
        try {
            // return an empty array if user is created
            await axios.post('http://localhost:5000/api/users', user);
            return [];
        } catch(error) {
            // pass array of errors if status 400 is returned
            if(error.response.status === 400) {
                return error.response.data.errors;
            } else {
                setErrors([ ...errors, error]);
            }
        }
    }

    // function to sign user out
    const signOut = () => {
        setAuthenticatedUser(null);
        setUser(null);
        // delete coookie when signing out
        Cookies.remove('authenticatedUser'); 
        Cookies.remove('encodedCredentials'); 
    }

    // POST request to /api/courses to create new course
    const createCourse = async(course, encodedCredentials) => {
        const options = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: `Basic ${ encodedCredentials }`,
              },
        };

        try {
            // pass course object to post method to create course
            // pass options as header to authenticate user
            await axios.post('http://localhost:5000/api/courses', course, options);
            
            // fetch courses API after new course added
            fetchAPI();

        } catch(error) {
            // return error arrays if status is 400
            if(error.response.status === 400) {
                return error.response.data.errors;
            } else {
                setErrors([ ...errors, error]);
            }
        }
    }

    // PUT request to /api/courses/:id to update course
    const updateCourse = async(courseId, updatedCourse, encodedCredentials) => {
        try {

            const options = {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Basic ${ encodedCredentials }`
                }
            };
            // PUT request, passing in Basic Authorization and updatedCourse
           await axios.put(`http://localhost:5000/api/courses/${ courseId }`, updatedCourse, options);
           fetchAPI();
        } catch(error) {
            console.error('An error occured while updating the course: ', error);
            if(error.response.status === 400) {
                return error.response.data.errors;
            } else {
                setErrors([ ...errors, error]);
            }        }
    }

    // DELETE request to /api/courses/:id to delete course
    const deleteCourse = async(courseId, encodedCredentials) => {
        try {
            const options = {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Basic ${ encodedCredentials }`
                }
            };

            await axios.delete(`http://localhost:5000/api/courses/${ courseId }`, options);
            fetchAPI();
            } catch(error) {
                console.error('An error occured while deleting the course: ', error);
                setErrors([ ...errors, error]);
        }
    }

    // pass courses state to Provider component
    return(
        <CourseContext.Provider value={{ 
            loading,
            courses,
            authenticatedUser,
            user,
            errors,
            action: {

                signIn,
                createUser,
                signOut,
                createCourse,
                updateCourse,
                deleteCourse,
            } 
        }} >
            { props.children }
        </CourseContext.Provider>
    );
}

// export consumer component to subscribe to context
export const Consumer = CourseContext.Consumer;
