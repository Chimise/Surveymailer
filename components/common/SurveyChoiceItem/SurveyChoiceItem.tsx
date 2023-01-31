import React from 'react';
import {CheckBadgeIcon} from '@heroicons/react/24/outline';
import cn from 'classnames';

interface SurveyChoiceItemProps {
    className?: string;
    choice: string;
    respondent: number;
}

const SurveyChoiceItem = ({className, choice, respondent}: SurveyChoiceItemProps) => {
    return (<div className={cn('flex items-center py-2 pl-2 pr-4', className)}>
        <div className='flex-1 space-x-3 truncate flex items-center'>
            <CheckBadgeIcon className='w-5 h-5 text-gray-500' />
            <div>{choice}</div>
        </div>
        
        <div className='shrink-0 bg-gray-200 px-3 py-1 rounded-md text-sm font-medium text-gray-800'>
            {respondent}
        </div>
    </div>)
}

export default SurveyChoiceItem;