# -*- coding: utf-8 -*-

# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, as long as
# any reuse or further development of the software attributes the
# National Geospatial-Intelligence Agency (NGA) authorship as follows:
# 'This software (django-gamification)
# is provided to the public as a courtesy of the National
# Geospatial-Intelligence Agency.
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

from django.conf.urls import patterns, url, include
from views import *


urlpatterns = patterns('',

    # PROJECTS

    url(r'^projects/(?P<projectname>\w+)/award/?$', 'gamification.core.views.award', name='award'),
    url(r'^projects/(?P<projectname>\w+)/points/?$', user_project_points_list),
    url(r'^projects/(?P<projectname>\w+)/points/?format=(?P<rendertype>\w+)?$', user_project_points_list),
    url(r'^projects/(?P<projectname>\w+)/total/?$', user_points),
    url(r'^projects/(?P<projectname>[\w,]+)/badges/?$', user_project_badges_list),
    url(r'^projects/(?P<projectname>[\w,]+)/badges/?format=(?P<rendertype>\w+)?$', user_project_badges_list),

    # POINTS
    url(r'^points/?$', user_points_list),

)
