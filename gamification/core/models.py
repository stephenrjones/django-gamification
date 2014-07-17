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

import json
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.utils.datastructures import SortedDict
from django.db.models.signals import post_save
from django.db import models
from gamification.badges.models import ProjectBadge


TRUE_FALSE = [(0, 'False'), (1, 'True')]


class ProjectBase(models.Model):
    """
    A generic model for GeoQ objects.
    """

    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200, help_text='Name of the project.')
    description = models.TextField(help_text='Details of this project that will be listed on the viewing page.')
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.name

    class Meta:
        abstract = True
        ordering = ('-created_at',)


class Project(ProjectBase):
    """
    Top-level organizational object.
    """

    private = models.BooleanField(default=False, help_text='Make this project available to all users.')
    #supervisors = models.ManyToManyField(User, blank=True, null=True, related_name="supervisors") #TODO: Add Supervisor Screen
    #teams = models.ManyToManyField(User, blank=True, null=True, related_name="supervisors")  #TODO: Add Teams
    viewing_pass_phrase = models.CharField(max_length=200, null=True, blank=True, help_text='Phrase that must be entered to view this page.')
    query_token = models.CharField(max_length=200, null=True, blank=True, help_text='Token that must be entered by any server requesting data - not implemented yet.')
    project_closing_date = models.DateTimeField(null=True, blank=True, help_text='Date that project "closes" with countdown shown on viewing page. Badges can still be added after this.')
    #TODO: Add Images for leaderboard

    @property
    def user_count(self):
        return User.objects.filter(analysts__project__id=self.id).distinct().count()

    def get_absolute_url(self):
        return reverse('project-detail', args=[self.id])


class Points(models.Model):
    user = models.ForeignKey(User)
    projectbadge = models.ForeignKey(ProjectBadge)
    value = models.IntegerField(default=0)
    date_awarded = models.DateTimeField('date awarded',auto_now=True)
    description = models.CharField(max_length=200)

    def get_absolute_url(self):
        return reverse('points-list', args=[self.id])

    class Meta:
        verbose_name_plural = "Points"


class UserProfile(models.Model):
    """ from http://stackoverflow.com/questions/44109/extending-the-user-model-with-custom-fields-in-django; this is one mechanism for adding extra details (currently score for badges) to the User model """
    defaultScore = 1
    user = models.OneToOneField(User)
    score = models.IntegerField(default=defaultScore)

    def __str__(self):
          return "%s's profile" % self.user

def create_user_profile(sender, instance, created, **kwargs):
    if created:
       profile, created = UserProfile.objects.get_or_create(user=instance)

post_save.connect(create_user_profile, sender=User)

import sys
if not 'syncdb' in sys.argv[1:2] and not 'migrate' in sys.argv[1:2]:
    from meta_badges import *