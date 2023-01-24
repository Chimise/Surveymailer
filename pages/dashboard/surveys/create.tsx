import React from "react";
import DashboardLayout from "../../../components/common/DashboardLayout";
import DraggableField from "../../../components/common/DraggableField";
import Input from "../../../components/ui/Input";
import TextArea from "../../../components/ui/TextArea";

const CreateSurveyPage = () => {
  return (
    <div className="w-full h-full">
      <div className="flex mt-24 mb-5 items-center justify-center md:h-full md:my-10">
      <div className="h-auto w-[85%] bg-white shadow-sm md:min-h-[85%] md:w-[90%]">
        <div className="flex flex-wrap p-4">
          <div className="w-full md:w-1/2 px-4 py-2">
            <Input label="Survey Title" error={false} />
          </div>
          <div className="w-full md:w-1/2 px-4 py-2">
            <Input label="Organization Name" error={false} />
          </div>
          <div className="w-full md:w-1/2 px-4 py-2">
            <Input label="Email Subject" error={false} />
          </div>
          <div className="w-full md:w-1/2 px-4 py-2">
            <Input label="Email Subject" error={false} />
          </div>
          <div className="w-full px-4 py-2">
            <TextArea label='Email Body' error={false}></TextArea>
          </div>
          <div className="w-full px-4 py-2">
            <TextArea label='Recipients' error={false}></TextArea>
          </div>
          <div className="w-full px-4 py-2">
            <DraggableField />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

CreateSurveyPage.isAuth = true;

CreateSurveyPage.getLayout = (children: React.ReactNode) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default CreateSurveyPage;
