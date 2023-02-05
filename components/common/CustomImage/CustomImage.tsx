import React, {useState} from 'react';
import Image, {ImageProps} from 'next/image';
import cn from 'classnames';

type FallBackImage  =  {src: string, fallbackText?: string} | {src?: string, fallbackText: string}
type CustomImageProps = FallBackImage & Omit<ImageProps, 'src'>;

const getFallBackUrl = (fallbackText: string) => `https://avatars.dicebear.com/api/initials/${fallbackText}.svg`;

const CustomImage = ({src, fallbackText = 'A A', className, alt, ...props}: CustomImageProps) => {
    const [imageSrc, setImageSrc] = useState(src || getFallBackUrl(fallbackText));

    return (<Image src={imageSrc} alt={alt} width={80} height={80} className={cn('rounded-full', className)} onError={() => setImageSrc(getFallBackUrl(fallbackText))} {...props} />)
}

export default CustomImage;