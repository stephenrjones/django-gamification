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


from django.contrib.auth.models import User
from models import Project
from gamification.badges.models import ProjectBadge, ProjectBadgeToUser
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404
import json
from gamification.badges.utils import project_badge_count

# REST interface

def projects(request, *args, **kwargs):
    if request.method == 'GET':
        try:
            user = get_object_or_404(User,username=kwargs['username'])
            project = get_object_or_404(Project,name=kwargs['projectname'])
        except Http404, e:
            context = { 'message' : e.__str__().split()[1] + ' not found' }
            return HttpResponse(json.dumps(context),'application/json',404)

        projbadges = ProjectBadge.objects.filter(project=project)
        badge_info = project_badge_count(user,project,projbadges)
        badge_detail_list = []
        for bi in badge_info:
            bstr = '{ "name":"%s", "awarded":%d, "url":"%s"}' % \
               ( bi['projectbadge__name'], bi['count'], bi['projectbadge__badge__icon'])
            badge_detail_list.append(json.loads(bstr))

        resp = '{"username":"%s", "badges":%s}' % (user.username, json.dumps(badge_detail_list))
        return HttpResponse(resp, mimetype="application/json")
    elif request.method == 'PUT':
        try:
            user = get_object_or_404(User,username=kwargs['username'])
            project = get_object_or_404(Project,name=kwargs['projectname'])
        except Http404, e:
            context = { 'message' : e.__str__().split()[1] + ' not found' }
            return HttpResponse(json.dumps(context),'application/json',404)
            
        award = request.GET['award']

        try:
            projbadge = get_object_or_404(ProjectBadge,name=award)
        except Http404, e:
            context = { 'message' : 'Project not found' }
            return HttpResponse(json.dumps(context), 'application/json', 404)

        # just add award for now
        projbadge.award_to(user);
        return HttpResponseRedirect('/users/%s/projects/%s' % (user, project))
       
