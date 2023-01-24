import React from 'react';
import DashboardLayout from '../../../components/common/DashboardLayout';

const SurveyPage = () => {
    return (<div>
        Survey Page
    </div>)
}

SurveyPage.isAuth = true;

SurveyPage.getLayout = (children: React.ReactNode) => {
    return (<DashboardLayout>
        {children}
    </DashboardLayout>)
}

export default SurveyPage;