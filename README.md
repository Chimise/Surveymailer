# SurveyMailer Application

Businesses usually need to get feedbacks from their customers about services they offer to further improve them. One of the ways to get the these feedbacks is by sending email surveys to your customers. This Next.js fullstack application provides simple functionalities for sending email surveys, tracking responses from the sent surveys in real time using websockets, provides interface for viewing feedbacks graphically, online payment using Paystack, previewing surveys before sending, password based authentication and google OAuth, sorting sent surveys by different fields and pagination.
## Video Demo
https://github.com/Chimise/Surveymailer/assets/66853110/0a65950a-9e24-488e-9c6e-c13e7d703556

## Live Demo
Here is a working live demo: [https://survey-mailer.vercel.app/](https://survey-mailer.vercel.app/)

## Usage
To run the project locally, follow these steps below:
* Install a mongodb database on your computer [if not already installed](https://www.mongodb.com/docs/manual/installation/).
* Install [Node.js](https://nodejs.org/en/download/) if not already installed.
* Clone this repository, create an .env.local file in the root folder and add the following enviromental variables
    * **MONGODB_URI** - A standard mongodb url connection string to connect to the mongodb database.
    * **JWT_TOKEN** - A random string to be used to generate the jwt token.
    * **GOOGLE_CLIENT_ID** & **GOOGLE_CLIENT_SECRET** - Can be gotten from Google Cloud Platform Console, [see details here](https://support.google.com/cloud/answer/6158849?hl=en), set your callback url to ```localhost:3000/api/auth/google/callback``` if your app is running on the default port or replace the port with the custom port you are using.
    * **MAIL_USERNAME** & **MAIL_PASSWORD** - The mail username can be any valid gmail address and the password can be [generated](https://support.google.com/mail/answer/185833?hl=en).
    * **NEXT_PUBLIC_PAYSTACK** & **PAYSTACK_SECRET** - paystack public and secret key [see more](https://support.paystack.com/hc/en-us/articles/360011508199-How-do-I-generate-new-API-keys-).
    * **PUSHER_PUBLIC_KEY** & **PUSHER_SECRET_KEY** - Obtained from pusher dashboard after creating a new project[create account to get started](https://dashboard.pusher.com/accounts/sign_up)
    * **PUSHER_CLUSTER** & **PUSHER_APP_ID** - Also obtained from pusher dashboard
    * **NEXT_PUBLIC_PUSHER_KEY** & **NEXT_PUBLIC_PUSHER_CLUSTER** - The same as the pusher public key and cluster respectively to be used by the client.
* Install the dependencies by running ```npm install``` and run the command ```npm run dev``` to start up your development server.
* Visit [http://localhost:3000](http://localhost:3000) to view the homepage of the web application.

## Technologies
Project was created with:
* [Next.js](https://nextjs.org/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Redux-toolkit and RTK Query](https://redux-toolkit.js.org/)
* [TypeScript](https://www.typescriptlang.org/)
