import {
    BaseRequestOptions, Http, RequestMethod, RequestOptions,
    Response, ResponseOptions, XHRBackend,
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
export class User {
    id: number;
    username: string;
    password: string;
    generalEmail: string;
    avatar: string;
    anotherEmail: string;
}

export class RegistrationForm {
    anotherEmail: string;
    avatar: string;
    firstName: string;
    generalEmail: string;
    id: string;
    lastName: string;
    mobilePhone: string;
    token: string;
    username: string;
}

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
    // array in local storage for registered users
    const DEFAULT: any = {
        avatar: './assets/images/empty_square.png',
    };
    const users: User[] = [
        { id: 0, username: 'admin', password: 'admin', generalEmail: 'admin@mail.com', avatar: 'DEFAULT.avatar', anotherEmail: 'string' },
        { id: 1, username: 'guest', password: 'guest', generalEmail: 'guest@mail.com', avatar: ' DEFAULT.avatar', anotherEmail: 'string' },
    ];
    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {
        // wrap in timeout to simulate server api call
        setTimeout(() => {

            // authenticate
            if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
                // get parameters from post request
                const params = JSON.parse(connection.request.getBody());

                // find if any user matches login credentials
                const filteredUsers = users.filter((user) => {
                    return user.username === params.username && user.password === params.password;
                });

                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    const user = filteredUsers[0];
                    connection.mockRespond(new Response(new ResponseOptions({
                        status: 200,
                        body: {
                            anotherEmail: user.anotherEmail,
                            avatar: user.avatar,
                            generalEmail: user.generalEmail,
                            id: user.id,
                            token: 'fake-jwt-token',
                            username: user.username,
                        },
                    })));
                } else {
                    // else return 400 bad request
                    connection.mockError(new Error('Username or password is incorrect'));
                }

                return;
            }

            // get users
            if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {
                // check for fake auth token in header and return users if valid, this security
                // is implemented server side in a real application
                if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: users })));
                } else {
                    // return 401 not authorised if token is null or invalid
                    connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                }

                return;
            }

            // get user by id
            if (connection.request.url.match(/\/api\/users\/\d+$/)
                && connection.request.method === RequestMethod.Get) {
                // check for fake auth token in header and return user if valid,
                // this security is implemented server side in a real application
                if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    const urlParts = connection.request.url.split('/');
                    const id = parseInt(urlParts[urlParts.length - 1], 10);
                    const matchedUsers = users.filter(user => user.id === id);
                    const user = matchedUsers.length ? matchedUsers[0] : null;

                    // respond 200 OK with user
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: user })));
                } else {
                    // return 401 not authorised if token is null or invalid
                    connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                }

                return;
            }

            // create user
            if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Post) {
                // get new user object from post body
                const newUserForm: RegistrationForm = JSON.parse(connection.request.getBody());

                // validation
                const duplicateUser = users.filter(user => user.username === newUserForm.generalEmail).length;
                if (duplicateUser) {
                    return connection.mockError(new Error('Username "' + newUserForm.generalEmail + '" is already taken'));
                }

                const newUser = new User();
                newUser.anotherEmail = newUserForm.anotherEmail;
                newUser.avatar = DEFAULT.avatar;
                newUser.generalEmail = newUserForm.generalEmail;
                newUser.id = users.length + 1;
                newUser['password'] = newUserForm['password'];
                newUser.username = newUserForm.generalEmail;

                // save new user
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // respond 200 OK
                connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));

                return;
            }

            // delete user
            if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Delete) {
                // check for fake auth token in header and return user if valid,
                // this security is implemented server side in a real application
                if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    const urlParts = connection.request.url.split('/');
                    const id = parseInt(urlParts[urlParts.length - 1], 10);
                    for (let i = 0; i < users.length; i++) {
                        const user = users[i];
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    // respond 200 OK
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
                } else {
                    // return 401 not authorised if token is null or invalid
                    connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                }

                return;
            }

            // pass through any requests not handled above
            const realHttp = new Http(realBackend, options);
            const requestOptions = new RequestOptions({
                method: connection.request.method,
                headers: connection.request.headers,
                body: connection.request.getBody(),
                url: connection.request.url,
                withCredentials: connection.request.withCredentials,
                responseType: connection.request.responseType,
            });
            realHttp.request(connection.request.url, requestOptions)
                .subscribe((response: Response) => {
                    connection.mockRespond(response);
                },
                (error: any) => {
                    connection.mockError(error);
                });

        }, 500);

    });

    return new Http(backend, options);
};

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions, XHRBackend],
};
