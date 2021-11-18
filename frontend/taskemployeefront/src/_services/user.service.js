import config from 'config';
import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout,
    getAll,
    AddEmployee,
    getEmployeeAll,
    UpdateEmployee,
    UploadExcel
};

function login(Username, Password) {
    const requestOptions = {
        method: 'POST',
        headers: {'Access-Control-Allow-Origin': '*','Content-Type': 'application/json'},
        body: JSON.stringify({ Username, Password }),
        crossDomain:true,
    };

    return fetch(`${config.apiUrl}/Users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function AddEmployee(employee) {
    var {Authorization} = authHeader();
    const requestOptions = {
        method: 'POST',
        headers: { Authorization
             , 'Access-Control-Allow-Origin': '*',
             'Content-Type': 'application/json'},
        body: JSON.stringify(employee),
        crossDomain:true,
    };

    return fetch(`${config.apiUrl}/Employee`, requestOptions)
        .then(handleResponse);
}

function UpdateEmployee(employee,id) {
    var {Authorization} = authHeader();
    const requestOptions = {
        method: 'PUT',
        headers: { Authorization
             , 'Access-Control-Allow-Origin': '*',
             'Content-Type': 'application/json'},
        body: JSON.stringify(employee),
        crossDomain:true,
    };

    return fetch(`${config.apiUrl}/Employee/${id}`, requestOptions)
        .then(handleResponse);
}
function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/Users`, requestOptions).then(handleResponse);
}

function UploadExcel(d) {
    const requestOptions = {
        method: 'POST',
        headers: { Authorization
            , 'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'},
       body: d,
       crossDomain:true,
    };

    return fetch(`${config.apiUrl}//FileUpload`, 
            requestOptions).
            then(handleResponse);
}

function getEmployeeAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/Employee`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}