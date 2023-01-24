import React, {useEffect} from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Loading from '../../../components/common/Loading';
import { useAppDispatch, RootState } from '../../../store';
import { googleLogIn } from '../../../store/auth';

const GoogleLoadingPage = () => {
    const {query, isReady, push} = useRouter();
    const {user, token} = useSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();
    useEffect(() => {
        async function googleSignUp() {
            if(isReady) {
                const access_token = Array.isArray(query.access_token) ? query.access_token[0] : query.access_token;
                const id_token = Array.isArray(query.id_token) ? query.id_token[0] : query.id_token;
                if(!access_token || !id_token) {
                    push('/auth/signin');
                    return;
                }
                const response = await dispatch(googleLogIn({access_token, id_token}));
                if(response.meta.requestStatus === 'rejected') {
                    push('/auth/signin');
                }
            }
        }

        if(!user || user.provider !== 'google') {
            googleSignUp();
        }
    }, [query, isReady, push, dispatch, user]);

    useEffect(() => {
        if(user && user.provider === 'google' && token) {
            push('/dashboard');
        }
     }, [user, token, push]);
    return <Loading size='lg' />
}

export default GoogleLoadingPage;