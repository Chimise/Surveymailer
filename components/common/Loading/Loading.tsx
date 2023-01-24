import React from 'react';
import Spinner, { SpinnerProps } from '../../ui/Spinner/Spinner';

interface LoadingProps extends SpinnerProps {

}

const Loading = (props: LoadingProps) => {
    return (<div className="h-screen w-screen flex items-center justify-center">
    <Spinner {...props} />
  </div>)
}

export default Loading;