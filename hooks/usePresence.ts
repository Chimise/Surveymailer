import React, {useEffect, useState} from 'react';


const usePresence = (ref: React.RefObject<HTMLElement>) => {
    const [isEntering, setIsEntering] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            setIsEntering(entries[0].isIntersecting);
        }, {
            threshold: 1
        })

        if(ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            observer.disconnect();
        }
    }, [ref])

    return isEntering;
}

export default usePresence;
