# -*- coding: utf-8 -*-

from django.contrib import admin

from models import Badge,BadgeSettings, ProjectBadge
from singleton_models.admin import SingletonModelAdmin

class BadgeAdmin(admin.ModelAdmin):
    fields = ('name','level','icon',)
    list_display = ('name','level')
    
    
class ProjectBadgeAdmin(admin.ModelAdmin):
    fields = ('name','description','project','badge')
    list_display = ('name', 'description')


admin.site.register(Badge, BadgeAdmin)
admin.site.register(BadgeSettings, SingletonModelAdmin)
admin.site.register(ProjectBadge, ProjectBadgeAdmin)
