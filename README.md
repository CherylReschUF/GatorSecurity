# Running our App

## Section 1: Cloning the repo:
* Make a folder somewhere on your computer
* `cd` to that folder from the command line
* Run `git clone https://github.com/cwojtak/GatorSecurity.git` to clone the repo

## Section 2: Installing Node.js packages
Run the following commands from the `senior_project_dea-main` directory:
* `npm i mdb-react-ui-kit`

Run the following commands from the `senior_project_dea-main/server` directory:
* `npm install cors`

## Section 3: Connecting to the database
From the `senior_project_dea-main/server` directory, do the following:
* Run `touch .env` to create a `.env` file
* Open that file and add the following:
* Note: You will need to replace the first three variables with the correct database credentials and JWT secret
```
DB_USERNAME=username
DB_PASSWORD=password
JWT_SECRET='secret'
LPORT=5000
```
* In the `GatorSecurity` directory (parent to `senior_project_dea-main` directory) create a `.gitignore` file if one does not already exist
* Add `.env` to the `gitignore` to prevent login credentials from being pushed to the repo

## Section 4: Pulling in the latest changes to your local environment
If changes are made in the repo, you will need to pull those changes in by doing the following:
* `cd` to the `senior_project_dea-main` directory (if not already there)
* Run `git pull origin main`

## Section 5: Creating a branch
### **All work you will ever do in a repo should be done in a branch. In other words, NEVER PUSH TO MAIN! EVER!**

There are 2 approaches to creating a branch.
### Option 1: Create branch from terminal
From the `senior_project_dea-main` directory run `git checkout -b <branch-name>` (i.e., `git checkout -b this-is-my-branch`). This will 
automatically switch you and all of you changes over to your new branch. See **Section 6** for the alternate `push` command you will need 
to run.

### Option 2: Create branch in Github and pull into you local repo
* Login to Github and go to `code` -> `branches`
* Click the `New Branch` button
* Name the branch whatever you like
* Complete steps from **Section 4**
* Run `git checkout <branch-name>` (i.e., `git checkout this-is-my-branch`)


## Section 6: Pushing your changes to the repo
If you've made changes locally and you want to commit and push those changes to the repo, do the following:
* `cd` to the `senior_project_dea-main` directory (if not already there)
* Run `git add .` to stage all changed files
* Run `git commit -m "your commit message"` to commit your local changes
* Run `git push` to push your changes to the repo (If you created your branch through the terminal, an error will pop up with the alternative command that you need to run the first time you push changes from this branch. The command will look like this, `git push --set-upstream origin <branch-name>`. Any additional pushes from this branch will only require the `git push` command.) 

## Section 7: Running the app locally
To start the backend run the following commands from the `senior_project_dea-main` directory:
* `cd server`
* `npm start`

To start the frontend run, open a second terminal in the `senior_project_dea-main` directory and run `npm start`.

# About the Included Database    
A database dump with an existing admin user and questions is included with distributions of this project. To see how to import this database dump, refer to `MongoDB Setup.pdf` in the Resources folder found in the root folder of this repository. The `Gator_Security_DB_Dump.zip` referred to in this document can be found in the same Resources folder.         

The administrative user included in this database dump has a default email `admin@localhost` and a default password `admin` that can be changed when using the application while logged in as the admin. It is highly recommended that these default credentials be changed when first using the application.         

# Backend Documentation
For the complete backend API documentation, please refer to `GatorSecurity Backend API Documentation.pdf` in the Resources folder found in the root folder of this repository. Accompanying this documentation are example Postman requests available under the Postman folder in the same Resources folder. You can refer to [this document](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-from-github-repositories:~:text=an%20API.-,Importing%20from%20GitHub%20repositories,-You%20can%20import) to see how to import these example requests into Postman.
Quick references for how to add questions are below.

## How to add traditional questions
Use the question edit page available to admin users to manipulate traditional questions.

## How to add a game question
First, use the Login example Postman request to login as an admin and obtain a token to perform these operations.           

Then, use the documentation and the Create Game example Postman request in order to create a game. If you want it to be a CYOA game, set the type to 0. If you want it to be a DND game, set the type to 1. If you want it to be a Matching game, set the type to 2. Refer to the constants documentation in the PDF for more information.    

After creating the game, use the Get Game by Type endpoint using the all type and find the ID of the game that was just created. You'll need to supply this to any CYOA, DND, or Matching questions you create.

Then, use the documentation and either the Create CYOA, Create DND, or Create Matching example Postman requests in order to create subquestions for the game. Make sure that the question type matches the GameQuestion type.          

After adding adding new questions, you should be able to refresh the Games page to see the game and play it.