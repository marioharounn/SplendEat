# Splendeat Backend

In order to run this project, you're going to need a working installation of python
[Find installation instructions here](https://www.python.org/about/gettingstarted/)

## Set up development environment

This is the recommended way to work with the backend

### Set up virtual environment

Make sure you have entered this directory in the terminal.
To set up a new venv, use the following command:

```
python -m venv .
```

You should only need to create it once.
Entering the environment however, needs to be done everytime you are going to run any django commands.
To enter the environment, these are the commands, depending on the operating system:

**Windows:**
```
./Scripts/activate
```

**Mac/Linux:**
```
source bin/activate
```

Some kind of indicator that you're in the environment should appear.
The indicator is usually a prefix to the prompt, looking something like this:

```
(backend) username@hostname: $ 
```

Now, we need to make sure that all the dependencies are installed, registered in the venv and up to date.
To do all of these things, run this command:

```commmand
pip install -r requirements.txt
```

Note: if running `pip` returns an error saying something along the lines of *Command or program named pip not found*, try using `python -m pip` instead.

You can double check that all dependencies are installed by checking that the ouput of

```commmand
pip freeze
```

is the same as the contents of [requirements.txt](requirements.txt)

If you want to install new dependenices, make sure to update `requirements.txt` by replacing the contents of the file with the new contents:

```commmand
pip freeze > requirements.txt
```

### Set up django

Ensure that you're in the environment

Start by creating a new database and applying all migrations:

```command
python manage.py migrate
```

Add an admin user, so that you can access the admin panel and add data or more users:

```command
python manage.py createsuperuser
```

Finaly

```command
python manage.py createsuperuser
```


You should now be able to access these links:

- [Website](https://localhost:8000/) (make sure [webpack is running](../frontend/README.md))
- [Admin Panel](https://localhost:8000/admin)
- [Interactive API](https://localhost:8000/api)
- [API Docs](https://localhost:8000/apidocs)

## Nuke the database

When switching around to different git branches, the database will sometimes not match the current branches scheme.
This could be fixed manually, but it's usually easer to just nuke the whole database and start from scratch.

Start by removing the database file

```command
rm db.sqlite3
```
Create a new database and apply all migrations:

```command
python manage.py migrate
```

Dont forget to add a new admin user:

```command
python manage.py createsuperuser
```

Now your new database should be ready to go!