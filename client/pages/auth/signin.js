import {useState} from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';


const signin =  () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {doRequest, errors} = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email,
            password
        },
        onSuccess: () =>  Router.push('/')
    });

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
         
        doRequest();
       
    }
    return (
        <form onSubmit={onSubmitHandler}>
            <h1>SignIn</h1>
            <div className="form-group">
                <label htmlFor="">
                    Email Address
                </label>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="form-control"/>
            </div>
            <div className="form-group">
                <label htmlFor="">
                    Password
                </label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control"/>
            </div>
            {errors}
            
            <button className="btn btn-primary">SignIn</button>
        </form>
    )
};

export default signin;