# Running our App

## Section 1: Cloning the repo:
* Make a folder somewhere on your computer
* `cd` to that folder from the command line
* Run `git clone https://github.com/erickcgt/senior_project_dea.git` to clone the repo

## Section 2: Installing Node.js packages
Start by deleting the package.json and package-lock.json from the server folder.
Run the following commands from the `senior_project_dea-main` directory:
* `npm init`
* `npm i mdb-react-ui-kit`
* `npm install express nodemon`
* `npm install mongoose`
* `npm install cors`
* `npm install bcryptjs`
* `npm install jsonwebtoken`
* `npm install --save dotenv`
* `npm install express-validator`

## Section 3: Connecting to the database
From the `senior_project_dea-main` directory, do the following:
* Run `touch .env` to create a `.env` file
* Open that file and add the following:
```
DB_USERNAME=username
DB_PASSWORD=password
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
* `npm run start`

To start the frontend run, open a second terminal in the `senior_project_dea-main` directory and run `npm run start`.
