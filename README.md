<br />
<div id="readme-top" align="center">
  <a href="https://github.com/itsmrval/accessgate">
    <img src="https://cdn-icons-png.flaticon.com/512/890/890132.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">AccessGate</h3>

  <p align="center">
    SSH key manager with automatic updates, user and group management
    <br />
    <br />
    View Demo
    ·
    <a href="https://github.com/itsmrval/accessgate/issues">Report Bug</a>
    ·
    <a href="https://github.com/itsmrval/accessgate/pulls">Pull request</a>
  </p>
</div>


<details>
  <summary>Table of contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">What is AccessGate ?</a>
      <ul>
        <li><a href="#built-with">Built with</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>



## What is AccessGate

<img src="https://i.imgur.com/8hYfzyS.png" width="500px">

You need to manage ssh keys for a project requiring multiple servers and groups, without having to manage them manually? This project lets you manage multiple servers with group permissions (server <-> group <-> user) from a clean, efficient web interface with github authentication for simpler management/security.

Few key points:
* Automatic key update when access is modified
* Permissions assigned to groups for more global management
* Restricted access per user, or with a single login on servers  


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

This section list major frameworks/libraries used

* ![](https://img.shields.io/badge/Nodejs-20232A?style=for-the-badge&logo=nodedotjs)
* ![](https://img.shields.io/badge/Express-20232A?style=for-the-badge&logo=express)
* ![](https://img.shields.io/badge/SqLite-20232A?style=for-the-badge&logo=sqlite&logoColor=blue)
* ![](https://img.shields.io/badge/GitHub%20OAUTH-20232A?style=for-the-badge&logo=github)
* ![](https://img.shields.io/badge/Bootstrap-20232A?style=for-the-badge&logo=bootstrap)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Now let's see how to set up an accessgate instance.
### Prerequisites

First, install the dependencies required, <b>don't forget to update your system before continuing</b>

* NodeJS 18+
  ```sh
  curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  apt install nodejs -y
  ```
* PM2
  ```sh
  npm i -g pm2
  ```
* Git
  ```sh
  apt install git -y
  ```
### Installation

1. Create directory
   ```sh
   mkdir /opt/accessgate
   cd /opt/accessgate
   ```
2. Clone the repo in the directory
   ```sh
   git clone https://github.com/itsmrval/accessgate.git .
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Copy and rename `exemple.env`
   ```js
   cp exemple.env .env
   ```
 5. Complete `.env`
	* GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET with your [Github app](https://github.com/settings/developers)
	* SESSION_SECRET with a secured random string
	
6. Run with PM2
   ```js
   pm2 start index.js
   pm2 save
   ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>





## Roadmap

- [x] Group and user management
- [x] Automatic server setup script
- [x] Multi user on one server
- [x] Admin area with key & username editing
- [ ] Permission management by non-admin user 
- [ ] Non-admin users can add servers
- [ ] Multi-language
    - [x] English
    - [ ] French
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
