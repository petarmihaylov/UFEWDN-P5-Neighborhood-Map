# UFEWDN-P5-Neighborhood-Map
Udacity's Front-End Web Development Nanodegree Project.

This is the 5th of six projects of this nonedegree.

The project represents a neighborhood map for Weston, FL. It is not exhaustive and only specific locations and businesses have been chosen to be highlighted.

**Note**
I do not live in Weston, FL and have no interest/ties in the places and business that are featured.

The project uses a Firebase database as the backend and utilizes the following APIs:

* Google Maps API
* Foursquare API

# Vagrant as a Development Environment
The project is being developed in a Vagrant environment in order to keep the project isolated from other development projects and allow a user to easily get started.

Vagrant is not needed in order to run this project as long all other requirements which are listed below are satisfied.

# How to Run the Project

## Run the Built Project Locally
1. Clone the repository to your local drive.

 ```
    git clone https://github.com/petarmihaylov/UFEWDN-P5-Neighborhood-Map
 ```
2. Navigate to the ```project\dist``` folder and open ```index.html``` in a browser.

## Run the project online

Open [https://nm.studio350.com](https://nm.studio350.com)

## Run the Project in Vagrant (for development)

1. Make sure Vagrant is installed.
2. Clone the repository to your local drive.

 ```
    git clone https://github.com/petarmihaylov/UFEWDN-P5-Neighborhood-Map
 ```
3. Open the project's root directory and run ```vagrant up```
4. Once finished (Step 3 may take a while) run ```vagrant ssh```
5. ```./bootstrap```
6. ```./update-toolset``` - This will move the npm root to the vagrant user's home directory and update Yeoman, Bower, and Grunt.
7. ```cd project```
8. ```gulp serve```
9. Navigate to ```localhost:9000``` from your local (vagrant host) machine.
