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


from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.views.generic import TemplateView, ListView

from django.contrib import admin
admin.autodiscover()
from gamification.core.models import Project
from gamification.core.api import ProjectBadgeResource, UserResource
from gamification.core.views import MasterProjectListView, ProjectListView, UserProjectPointsView, BadgeListView, UserView
from tastypie.api import Api

g_api = Api(api_name='v1')
g_api.register(ProjectBadgeResource())
g_api.register(UserResource())

urlpatterns = patterns("",
    url(r"^gamification/$", TemplateView.as_view(template_name="core/index.html"), name="home"),
    url(r"^admin/", include(admin.site.urls)),
    url(r"^account/", include("account.urls")),
    url(r"^api/", include(g_api.urls)),
    url(r"^users/?$", UserView.as_view(template_name='core/users.html'), name='user_list'),
    url(r"^users/(?P<username>\w+)/", include("gamification.core.urls")),
    url(r"^projects/?$", ListView.as_view(queryset=Project.objects.all(), template_name='core/projects.html')),
    url(r"^projects/all/", MasterProjectListView.as_view(template_name='core/masterprojects_list.html'), name='master-project-list'),
    url(r"^projects/(?P<projectname>\w+)/?$", ProjectListView.as_view(template_name='core/projects_list.html'), name='project-list'),
    url(r"^projects/(?P<projectname>\w+)/badges/?$", BadgeListView.as_view(template_name='core/badge_list.html'), name='badge-list'),
)

# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
