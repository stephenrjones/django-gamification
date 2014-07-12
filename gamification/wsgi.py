# -*- coding: utf-8 -*-

"""
WSGI config for django_gamification project.

This module contains the WSGI application used by Django's development server
and any production WSGI deployments. It should expose a module-level variable
named ``application``. Django's ``runserver`` and ``runfcgi`` commands discover
this application via the ``WSGI_APPLICATION`` setting.

"""
import os
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gamification.settings")
sys.path.append(os.path.dirname(__file__))

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
