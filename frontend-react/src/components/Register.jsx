import React, { useState } from 'react';
import axiosInstance from '../axiosInstance'; // <-- Change this path if necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegistration = async (e) => {
        e.preventDefault();

        setLoading(true);
        setErrors({});
        setSuccess(false);

        const userData = {
            username,
            email,
            password,
        };

        try {
            const response = await axiosInstance.post('/register/', userData);

            console.log('Registration successful:', response.data);

            setSuccess(true);

            setUserName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error(error);

            if (error.response) {
                setErrors(error.response.data);
            } else {
                setErrors({
                    general: ['Unable to connect to the server. Please try again later.'],
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 bg-light-dark p-5 rounded">
                        <h3 className="text-light mb-4 text-center">
                            Create an Account
                        </h3>

                        <form onSubmit={handleRegistration}>

                            {errors.general && (
                                <div className="alert alert-danger">
                                    {errors.general[0]}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success">
                                    Registration Successful!
                                </div>
                            )}

                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                />

                                {errors.username && (
                                    <small className="text-danger">
                                        {errors.username[0]}
                                    </small>
                                )}
                            </div>

                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                {errors.email && (
                                    <small className="text-danger">
                                        {errors.email[0]}
                                    </small>
                                )}
                            </div>

                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Set password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                {errors.password && (
                                    <small className="text-danger">
                                        {errors.password[0]}
                                    </small>
                                )}
                            </div>

                            {loading ? (
                                <button
                                    type="submit"
                                    className="btn btn-info d-block mx-auto"
                                    disabled
                                >
                                    <FontAwesomeIcon icon={faSpinner} spin />{' '}
                                    Please wait...
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="btn btn-info d-block mx-auto"
                                >
                                    Register
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;