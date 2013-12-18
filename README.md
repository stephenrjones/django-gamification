# django-gamification

#### Django Gamification API ####

The aim of this project is to create a prototype API for implementing game incentives into an application

Anyone who would like to change development priorities is welcome to Fork the library. Please submit any proposed fixes or improvements through a Github Pull Request.

### django-gamificaiton Configuration ###

The ``django-gamification/settings.py`` file contains installation-specific settings. The Database name/pw and server URLs will need to be configured here.


### django-gamification Installation ###


1. Make sure Python, Virtualenv, and Git are installed

2. Install and setup geoq-django:

        % mkdir -p ~/pyenv
        % virtualenv --no-site-packages ~/pyenv/gamification
        % source ~/pyenv/gamification/bin/activate
        % git clone https://github.com/stephenrjones/django-gamification
        
3. Create the database and sync dependencies and data

        % cd django-gamification
        % pip install paver
        % paver install_dependencies
        % paver createdb
        % paver create_db_user
        % paver sync


4. Build user accounts:

        % python manage.py createsuperuser


9. Start it up!

        % python manage.py runserver


### License ###
MIT license

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, as long as any reuse or further development of the software attributes the authorship as follows: 'This software (django-gamification) is provided to the public as a courtesy of the National Geospatial-Intelligence Agency.

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


### TODOs ###
Current next development goals are tracked as Issues within GitHub, and high-level goals are in ```django-gamification/TODO.rst```.
