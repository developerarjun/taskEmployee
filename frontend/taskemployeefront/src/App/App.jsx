import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { ManageEmployee } from '../_manageEmploye'

class App extends React.Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }
    render() {
        const { alert } = this.props;
        const { user, users } = this.props;
        return (
            <div>
                 <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
                    <h5 className="my-0 mr-md-auto font-weight-normal">Employee</h5>
                    <nav className="my-2 my-md-0 mr-md-3">
                    {user && <a className="p-2 text-dark" href="/">Home</a> }    

                    {user && <a className="p-2 text-dark" href="/manage-employee">Manage Employee</a> }    
                  {user &&  <a className="p-2 text-dark">Welcome: <strong>{user.firstName}</strong> </a>}

                    </nav>
                    {user &&  <a className="btn btn-outline-primary" href="/login">Logout</a> }
                    
                    { !user && <a className="btn btn-outline-primary" href="/login">Login</a> }
                </div>
            <div className="jumbotron">
                <div className="container">
                    <div className="col-sm-8 col-sm-offset-2">
                        {alert.message &&
                            <div className={`alert ${alert.type}`}>{alert.message}</div>
                        }
                        <Router history={history}>
                            <div>
                                <PrivateRoute exact path="/" component={HomePage} />
                                <Route path="/login" component={LoginPage} />
                                <PrivateRoute exact path="/manage-employee" component={ManageEmployee} />
                            </div>
                        </Router>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users,
        alert
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 