# enekrend.hu

## About <a name = "about"></a>

This is the source code of the **enekrend.hu** website, a platform for making the tradition of Latin Liturgical History easily accessible for everyone.

The project is not in a state yet where it can be used by others, so the enekrend.hu domain is not yet pointing to this repository.

### Used technologies

- [![React][react-shield]][react-url]
- [![Material UI][mui-shield]][mui-url]
- [![Firebase][firebase-shield]][firebase-url]
- [![TypeScript][typescript-shield]][typescript-url]


## Getting Started <a name = "getting_started"></a>

### Prerequisites

- [![Node.js][node-shield]][node-url]
- [![npm][npm-shield]][npm-url]

### Installing

1. Install dependencies

After downloading te project, run the following command in the root directory of the project:

```bash
npm install
```

2. Create a `.env` file 

In the root directory of the project, copy the `.env.sample` file and rename it to `.env`.
Then, fill the required fields with the appropriate values. For that, you will need credentials from a [Firebase][firebase-url] project
set up with Firestore and Authentication.

3. Start the development server

Then you can start the development server with the following command:

```bash
npm run dev
```

## Keeping track of the project

A GitHub project on [this][github-project-url] page is used to keep track of the project's progress.


<!-- MARKDOWN LINKS & IMAGES -->

[mui-shield]: https://img.shields.io/badge/MUI-v5.12-blue?style=flat-square&logo=mui
[mui-url]: https://mui.com/
[firebase-shield]: https://img.shields.io/badge/Firebase-v9.18-orange?style=flat-square&logo=firebase
[firebase-url]: https://firebase.google.com/
[react-shield]: https://img.shields.io/badge/React-v18.2-blue?style=flat-square&logo=react
[react-url]: https://reactjs.org/
[typescript-shield]: https://img.shields.io/badge/TypeScript-v4.9.3-blue?style=flat-square&logo=typescript
[typescript-url]: https://www.typescriptlang.org/
[node-shield]: https://img.shields.io/badge/Node.js-v14.15.4-green?style=flat-square&logo=node.js
[node-url]: https://nodejs.org/en/
[npm-shield]: https://img.shields.io/badge/npm-v6.14.10-red?style=flat-square&logo=npm
[npm-url]: https://www.npmjs.com/
[github-project-url]: https://github.com/users/BrownieMaar/projects/2
