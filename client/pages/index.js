import buildClient from '../api/buildClient';


const index = ({currentUser}) => {
    return currentUser ? <h1>You are Sign In</h1> : <h1>You are Not Sign In</h1>
    
};

index.getInitialProps = async (context) => {
    const {data} = await buildClient(context).get('/api/users/currentuser');
    return data;
};


export default index;