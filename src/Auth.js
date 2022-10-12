import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isAuth = () => {
    // console.log(localStorage.getItem('accessToken'));
    return localStorage.getItem('accessToken') !== null && localStorage.getItem('acceptedTermsOfUse') == 'true';
}

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                isAuth() ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/',
                            state: { message: 'Usuário não autorizado' }
                        }}
                    />
                )}
        />
    );
}

export const LoginRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                !isAuth() ? (
                    <Component {...props} />
                ) : (
                    localStorage.getItem('accessToAll') ?
                        <Redirect
                            to={{
                                pathname: '/dashowner',
                                state: { message: 'Usuário não autorizado' }
                            }}
                        /> :
                        localStorage.getItem('accessToFinancial') ?
                            <Redirect
                                to={{
                                    pathname: '/dash',
                                    state: { message: 'Usuário não autorizado' }
                                }}
                            /> :
                            localStorage.getItem('accessToProducts') ?
                                <Redirect
                                    to={{
                                        pathname: '/product',
                                        state: { message: 'Usuário não autorizado' }
                                    }}
                                /> :
                                localStorage.getItem('accessToEvents') ?
                                    <Redirect
                                        to={{
                                            pathname: '/event',
                                            state: { message: 'Usuário não autorizado' }
                                        }}
                                    /> :
                                    <Redirect
                                        to={{
                                            pathname: '/associated',
                                            state: { message: 'Usuário não autorizado' }
                                        }}
                                    />

                )}
        />
    );
}

export default PrivateRoute;