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

from dateutil.parser import parse
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.datastructures import MultiValueDictKeyError
from django.core.exceptions import ObjectDoesNotExist
from gamification.core.models import Project
from gamification.events.models import Event
from gamification.events.state import State
from intellect.Intellect import Intellect

# For debug
from datetime import datetime

def handle_event(request, *args, **kwargs):
    if request.method == 'POST':
        
        # Get event user
        username=kwargs['username']
        try:
            user = User.objects.get(username=username)
        except ObjectDoesNotExist:
            return HttpResponse('User not found', status=404)
        #print('handle_event found username {0}').format(username)
        
        # Get event project
        projectname=kwargs['projectname']
        try:
            project = Project.objects.get(name=projectname)
        except ObjectDoesNotExist:
            return HttpResponse('Project not found', status=404)
        #print('handle_event found projectname {0}').format(projectname)
        
        # Get event DTG
        try:
            event_dtg_str = request.POST['event_dtg']
            try:
                event_dtg = parse(event_dtg_str)
            except ValueError:
                return HttpResponse('Invalid event_dtg', status=400)      
        except MultiValueDictKeyError:
            event_dtg = timezone.now()
        #print('handle_event got event_dtg {0}').format(datetime.strftime(event_dtg, '%Y-%m-%dT%H:%M:%S%Z'))
        
        # Get event details
        try:
            details = request.POST['details']
        except MultiValueDictKeyError:
            details = None
        #print('handle_event got details {0}').format(details)
        
        # Create Event object
        try:
            event = Event(user=user, project=project, event_dtg=event_dtg, details=details)
        except ValueError, ve:
            #print('handle_event failed create event: {0}').format(ve)
            return HttpResponse('Invalid event', status=400) # If, for example, 'details' JSON does not load   
        
        # Save Event object
        event.save()
       
        #####################################################################
        # 'Training' demo policies. Assumes there is a 'training' project with badge id 1. Badge awarded when all courses finished.
        # Sample curl command for sending event for user 'admin': 
        # curl -d "details={\"event_type\":\"course_complete\",\"course_id\":\"008031\"}" http://localhost:8000/users/admin/projects/training/event/
        #state_policy = "from gamification.events.models import Event\nrule 'Rule 1':\n\twhen:\n\t\t$event := Event(('event_type' in details_map) and ('course_complete' in details_map['event_type']) and ('course_id' in details_map))\n\tthen:\n\t\t$event.update_state('course_complete', $event.details_map['course_id'], $event.event_dtg)\n"
        #award_policy = "from gamification.events.state import State\nrule 'Rule 1':\n\twhen:\n\t\t$state := State((project.name == 'training') and ('course_complete' in event_data) and ('008031' in event_data['course_complete']) and ('008189' in event_data['course_complete']) and ('008582' in event_data['course_complete']) and ('009446' in event_data['course_complete']) and ('013413' in event_data['course_complete']) and ('013567' in event_data['course_complete']) and ('016003' in event_data['course_complete']) and ('016094' in event_data['course_complete']) and ('017724' in event_data['course_complete']) and ('020146' in event_data['course_complete']) and ('023416' in event_data['course_complete']))\n\tthen:\n\t\t$state.award($state.user, $state.project, 1)\n"
        #####################################################################

        #####################################################################
        # 'GeoQ AOI' demo policies. Assumes there is a 'geoq' project with badge id 4. Badge awarded when at least three AOIs are completed.
        # Sample curl command for sending event for user 'admin':
        # curl -d "details={\"event_type\":\"aoi_complete\",\"aoi_id\":\"2\"}" http://localhost:8000/users/admin/projects/geoq/event/
        state_policy = "from gamification.events.models import Event\nrule 'Rule 1':\n\twhen:\n\t\t$event := Event(('event_type' in details_map) and ('aoi_complete' in details_map['event_type']) and ('aoi_id' in details_map))\n\tthen:\n\t\t$event.update_state('aoi_complete', $event.details_map['aoi_id'], $event.event_dtg)\n"
        award_policy = "from gamification.events.state import State\nrule 'Rule 1':\n\twhen:\n\t\t$state := State((project.name == 'geoq') and ('aoi_complete' in event_data) and (len(event_data['aoi_complete']) >= 3))\n\tthen:\n\t\t$state.award($state.user, $state.project, 4)\n"
        #####################################################################

        # Build state
        intellect = Intellect()
        intellect.learn(state_policy)
        events = Event.objects.filter(user=user, project=project)
        event_data = {}
        state = State(user, project, event_data)
        for e in events:
            e.state = state
            intellect.learn(e)
        intellect.reason()
              
        # Apply award policy       
        intellect = Intellect()
        intellect.learn(award_policy)
        intellect.learn(state)
        intellect.reason()
      
        return HttpResponse(status=200)
