# IMAGE UP 🖼️🢁

## Table of Contents

1. Description
2. Badges
3. Visuals
4. Installation
5. Usage
6. Dev Stuff: Building
7. Bugs 
8. To do
9.  Support
10. Contributing 
11. Authors and acknowledgment
12. License
13. Project status

## (1) Description

A small project to make an image uploading and hosting app. Image hosting through a free tier account (1 year trial) on Microsoft Azure. Hosed images can be saved to User array and retrieved with URL for reference on User's profile page.

Images are sent to my storage container on Azure, and retrieved from the container and displayed on the page, with newly created URL

Lessons learned from building this project:

- File uploading
- File hosting
- Saving images to User file
- Learning to use new tech:
  - ~~Formik;~~
  - ~~Yup;~~
  - Multer;
  - ~~graphql-upload;~~
  - react-dropzone
- Cloud Storage with MS Azure Blob Storage
- Implement cloud hosting first, rather than uploading. Harder to get cloud into working uploading code, than uploading into working cloud hosting code. 

## (2) Badges

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white) 
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) 
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) 
[Formik](https://img.shields.io/badge/Formik-2563EB.svg?style=for-the-badge&logo=Formik&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) 
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)
![FontAwesome](https://img.shields.io/badge/Font%20Awesome-538DD7.svg?style=for-the-badge&logo=Font-Awesome&logoColor=white) 
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

## (3) Visuals

[Visit App deployed to Heroku](https://snake-10-afd58bdf61b8.herokuapp.com/)

![snakeShot1](https://github.com/user-attachments/assets/f0c48cd9-b96a-4cf2-91d9-5d531c1137a3)

## (4) Installation

```bash
git clone https://github.com/sifzerda/ImageUp.git
cd imageUp
npm install
npm run start
```

Image hosting through Microsoft Azure Blob Storage.

process.env not recognized in vite react unless you modify vite.config file:

```bash
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.SOME_KEY': JSON.stringify(env.SOME_KEY)
    },
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/graphql': {
          target: 'http://localhost:3001',
          secure: false,
          changeOrigin: true
        }
      }
    }, 
    test: {
      environment: 'happy-dom',
      globals: true
    }

  }
})
```

## (5) Usage

Images are uploaded and hosted on MS Azure. If user is logged in, URLs for uploaded images can be saved in user's model and can be retrieved on their profile page. This is recommended otherwise user will lose access to image.

## (6) Dev Stuff: Building:

### Tech used:
- <strong>axios:</strong> promise-based JavaScript library and API to make asynchronous HTTP requests. 
- <strong>react-dropzone:</strong> library for handling 'drag-and-drop' file uploads.
- <strong>multer:</strong> middleware for handling file uploading.
- <strong>cors:</strong>
- <strong>formik:</strong> react library for form building and processing.
- <strong>yup:</strong> schema builder for value parsing and validation.
- <strong>~~cloudinary:~~ </strong>media hosting on cloud. Tried to use this for image hosting storage but didn't work. 
- <strong>~~Amazon:~~ </strong>media hosting on cloud.
- <strong>~~Google:~~ </strong>media hosting on cloud.
- <strong>azure/storage-blob: </strong> Client library providing object storage in cloud.

1. <u>'const handleUpload':</u> uploads image and also sends to MS Azure cloud container.
2. <u>'const handleSave':</u> onclick handler which writes uploaded image to logged in user's imageUrls array.

### Alternate Config:

N/A

## (7) Bugs: 

- Could not get Firebase cloud service to host images, will try with new component

## (8) To do: 

- [x] create image uploading
- [x] upload multiple images
- [x] store uploaded images
  - [ ] local storage;
  - ~~[ ] if user logged on~~
  - ~~[ ] restrict image uploading to registered users and when upload images, auto save to their user record - to retrieve when site returned to~~
- [x] images get unique url so they can be viewed image alone on separate page (i.e. openeed as new tab and linked in url and shared)
- [x] make some graphql queries and mutations to store uploaded cloud images urls to be retrievable when users log in again

## (10) Support

For support, users can contact tydamon@hotmail.com.

## (11) Contributing

Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". 
1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/NewFeature)
3. Commit your Changes (git commit -m 'Add some NewFeature')
4. Push to the Branch (git push origin feature/NewFeature)
5. Open a Pull Request

## (12) Authors and acknowledgment

The author acknowledges and credits those who have contributed to this project, including:

- ChatGPT

## (13) License

Distributed under the MIT License. See LICENSE.txt for more information.

## (14) Project status

This project is complete.


 
 