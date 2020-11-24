import React, { useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { CourseContext } from './context';



const UserSignOut = () => {
        
    // subscibe to context and call signOut action
        const {action} = useContext(CourseContext);
        
        useEffect(() =>  action.signOut());

        // redirect to root url
                return(
                    <Redirect to='/' />
                );

}

export default UserSignOut;