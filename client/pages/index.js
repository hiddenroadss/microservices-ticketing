import axios from 'axios';


const index = ({currentUser}) => {
    return <h1> Index page </h1>;
};

index.getInitialProps = async ({req}) => {
    if (typeof window === 'undefined') {
        //we are on the server
        const {data} = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
            headers: req.headers
        });
        return data;
    } else {
        //we are on the browser
        const {data} = await axios.get('/api/users/currentuser');
        return data;
    }
}


export default index;