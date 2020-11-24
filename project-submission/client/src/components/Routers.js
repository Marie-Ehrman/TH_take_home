import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import components
import PrivateRoute from './PrivateRoute';
import Courses from './Courses';
import CreateCourse from './CreateCourse';
import UpdateCourse from './UpdateCourse';
import CourseDetail from './CourseDetail';
import UserSignIn from './UserSignIn';
import UserSignUp from './UserSignUp';
import UserSignOut from './UserSignOut';
import NotFound from './NotFound';
import Forbidden from './Forbidden';
import Error from './UnhandledError';

// function to render Components with correct routes
    // use Switch Component to only render one route
    // Redirecdt to home page if no route matches
const Routers = () => {
    return(
        // use { ...routeProps } to pass route properties to component
        // Render PrivateRoute for URLs that require users to log in to visit
        <Switch>
            <Route exact path='/' render={ () => <Courses /> } />
            <PrivateRoute exact path='/courses/create' component={ CreateCourse } /> 
            <Route exact path='/courses/:id' render={ (routeProps) => <CourseDetail { ...routeProps } /> } /> 
            <PrivateRoute exact path='/courses/:id/update' component={ UpdateCourse } />
            <Route exact path='/signin' render={ (routeProps) => <UserSignIn { ...routeProps } /> } />
            <Route eact path='/signup' render={ (routeProps) => <UserSignUp { ...routeProps } /> } />
            <Route exact path='/signout' render={ () => <UserSignOut /> } />
            <Route exact path='/notfound' render={ () => <NotFound /> } />
            <Route exact path='/forbidden' render={ () => <Forbidden /> } />
            <Route exact path='/error' render={ () => <Error /> } />
            <Route render={ () => <NotFound />} /> {/* render NotFound Component if route isn't matched */}
        </Switch>
    );
}

export default Routers;