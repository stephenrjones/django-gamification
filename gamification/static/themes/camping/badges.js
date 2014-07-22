var badges = {$holder:null};
badges.imageUrlPrefix = "/static/";

badges.init = function(){
    //Initialization
    badges.$holder = $("<div>");

    if (!project_info.properties) project_info.properties = {};
    badges.dontHighlightBottom = project_info.properties.dontHighlightBottom;
    badges.dontShowBottomPercent = project_info.properties.dontShowBottomPercent;
    if (typeof badges.dontHighlightBottom=="undefined") badges.dontHighlightBottom=true;
    if (typeof badges.dontShowBottomPercent=="undefined") badges.dontShowBottomPercent=0.0;

    //Move leaderboards around
    $('#leader_board_table').appendTo('#data_graph');
    $('#leader_board').append(badges.$holder);
    if (typeof project_info!="unknown" && project_info.badge_json){
        if (project_info.properties.badges_mode && project_info.properties.badges_mode=="cards"){
            badges.drawBadgesCardTable(project_info.badge_json || []);
        } else {
            badges.drawBadgesTable(project_info.badge_json || []);
        }
    }
};
badges.nameFormat = function(name){
    var lenName = name.length;
    return name.substring(0,1).toUpperCase() + name.substring(1,lenName-1)+ name.substring(lenName-1,lenName).toUpperCase();
};
badges.drawBadgesTable = function(badges_data) {
    var badgeWidth = 31;
    var badgeTwoThirds = parseInt(badgeWidth*2/3);
    var badgeHalf = parseInt(badgeWidth/2);
    var badgeThird = parseInt(badgeWidth/3);
    var badgeFifth = parseInt(badgeWidth/5);

    var totalBadges = 0;
    var maxBadges = 0;
    var minBadges = 100000000;

    var usersCount = badges_data.length;
    var numToShow = parseInt(usersCount * (1-badges.dontShowBottomPercent));

    var badges_data_new = badges.groupBadges(badges_data);
    badges_data_new = _.first(badges_data_new,numToShow);

    var $person_badge_holders = [];
    var $person_badge_holders_text = [];

    _.each(badges_data_new,function(awardee){
        var badgeCount = 0;
        var $person = $('<span>')
            .addClass('personHeader')
            .appendTo(badges.$holder);
        $person_badge_holders.push($person);

        var $personText = $('<div>')
            .addClass('personHeaderText')
            .appendTo($person);
        $person_badge_holders_text.push($personText);

        _.each(awardee[1],function(badge){
            var name = badge[0].badge || "Badge";
            var url = badge[0].icon;
            if (document.location.host == "") {
                url = "../../" + url;
            } else {
                url = badges.imageUrlPrefix + url;
            }

            var $badge = $('<span>')
                .addClass('personBadgeHolder')
                .css({background:'url('+url+')',backgroundSize:'100% 100%', width:badgeWidth+'px',height:badgeWidth+'px',borderRadius:badgeThird+'px'})
                .attr('title',name)
                .popover({
                    title: name,
                    html : true,
                    content:'<b>Badge: '+name+'</b><br/><img src="'+url+'" width:100></img>',
                    trigger:'hover',
                    container:'#my-tab-content',
                    placement:'auto'
                })
                .appendTo($person);

            $('<span>')
                .addClass('personBadgeHolderMeatball')
                .html('.')
                .css({top:(badgeThird-1)+'px',left:badgeThird-1+'px',width:badgeHalf+4+'px',fontSize:badgeHalf+2+'px',borderRadius:badgeThird+'px'})
                .appendTo($badge);

            $('<span>')
                .addClass('personBadgeHolderText')
                .text(badge.length)
                .css({top:(badgeThird)+'px',width:badgeWidth+'px',fontSize:badgeTwoThirds+'px'})
                .appendTo($badge);

            badgeCount+=badge.length;
        });
        totalBadges += badgeCount;
        if (badgeCount < minBadges) minBadges = badgeCount;
        if (badgeCount > maxBadges) maxBadges = badgeCount;
    });

    var maxSecondBadges=0;
    _.each(badges_data,function(awardee){
        var badgeCount = awardee[1].length;
        if (badgeCount > maxSecondBadges && badgeCount!=maxBadges) maxSecondBadges = badgeCount;
    });

    var maxThirdBadges=0;
    _.each(badges_data,function(awardee){
        var badgeCount = awardee[1].length;
        if (badgeCount > maxThirdBadges && badgeCount!=maxBadges && badgeCount!=maxSecondBadges) maxThirdBadges = badgeCount;
    });


    _.each(badges_data,function(awardee,i){
        if (i<numToShow){
            var badgeCount = awardee[1].length;
            var name = _.str.capitalize(badges.nameFormat(awardee[0]));
            var bgColor = "#eff";
            var badge = "";

            if (badgeCount == maxBadges){
                bgColor='#F1F7CC';
                badge="Gold";
            } else if (badgeCount == maxSecondBadges){
                bgColor='#F6F9F9';
                badge="Silver";
            } else if (badgeCount == maxThirdBadges){
                bgColor='#E5D8CC';
                badge="Copper";
            } else if (!badges.dontHighlightBottom && badgeCount == minBadges){
                bgColor='#F1CCCC';
                badge="Last";
            }

            var title = name + " ("+badgeCount;
            if (badge) title = title + " - "+badge;
            title = title+")";

            $person_badge_holders[i]
                .css({backgroundColor:bgColor});

            $person_badge_holders_text[i]
                .text(title);
        }
    });
    if (numToShow<usersCount){
        var $person = $('<span>')
            .addClass('personHeader')
            .appendTo(badges.$holder);

        var numLeft = usersCount-numToShow;
        $('<div>')
            .addClass('personHeaderText')
            .html('Additional '+numLeft+'<br/>awardees not shown<br/>...')
            .appendTo($person);

    }
};

badges.drawBadgesCardTable = function(badges_data) {
    var badgeWidth = 27;
    var badgeTwoThirds = parseInt(badgeWidth*2/3);
    var badgeHalf = parseInt(badgeWidth/2);
    var badgeThird = parseInt(badgeWidth/3);

    var totalBadges = 0;
    var maxBadges = 0;
    var minBadges = 100000000;

    var totalPoints = 0;
    var maxPoints = 0;
    var minPoints = 100000000;


    var usersCount = badges_data.length;
    var numToShow = parseInt(usersCount * (1-badges.dontShowBottomPercent));

    var badges_data_new = badges.groupBadges(badges_data);
    badges_data_new = _.first(badges_data_new,numToShow);

    var $person_badge_holders = [];
    var $person_badge_holders_text = [];

    _.each(badges_data_new,function(awardee){
        var badgeCount = 0;
        var pointCount = awardee[2] || awardee[1].length || 0;
        var $person = $('<span>')
            .addClass('personHeaderCard')
            .appendTo(badges.$holder);
        $person_badge_holders.push($person);

        var name = _.str.capitalize(badges.nameFormat(awardee[0]));
        var $personText = $('<span>')
            .addClass('personHeaderCardText')
            .text(name)
            .appendTo($person);
        $person_badge_holders_text.push($personText);

        var $badgeHolder = $('<div>')
            .addClass('personCardBadgeHolder')
            .appendTo($person);


        _.each(awardee[1],function(badge){
            var name = badge[0].badge || "Badge";
            var url = badge[0].icon;
            if (document.location.host == "") {
                url = "../../" + url;
            } else {
                url = badges.imageUrlPrefix + url;
            }

            var $badge = $('<span>')
                .addClass('personBadgeHolderCard')
                .css({background:'url('+url+')',backgroundSize:'100% 100%', width:badgeWidth+'px',height:badgeWidth+'px',borderRadius:badgeThird+'px'})
                .attr('title',name)
                .popover({
                    title: name,
                    html : true,
                    content:'<b>Badge: '+name+'</b><br/><img src="'+url+'" width:100></img>',
                    trigger:'hover',
                    container:'#my-tab-content',
                    placement:'auto'
                })
                .attr('title',name)
                .appendTo($badgeHolder);

            $('<span>')
                .addClass('personBadgeHolderMeatball')
                .html('.')
                .css({top:(badgeThird-1)+'px',left:badgeThird-1+'px',width:badgeHalf+4+'px',fontSize:badgeHalf+2+'px',borderRadius:badgeThird+'px'})
                .appendTo($badge);

            $('<span>')
                .addClass('personBadgeHolderText')
                .text(badge.length)
                .css({top:(badgeThird)+'px',width:badgeWidth+'px',fontSize:badgeTwoThirds+'px'})
                .appendTo($badge);

            badgeCount+=badge.length;
        });
        totalBadges += badgeCount;
        if (badgeCount < minBadges) minBadges = badgeCount;
        if (badgeCount > maxBadges) maxBadges = badgeCount;

        totalPoints += pointCount;
        if (pointCount < minPoints) minPoints = pointCount;
        if (pointCount > maxPoints) maxPoints = pointCount;
    });

    //Find who's in 2nd+3rd place
    var maxSecondBadges=0;
    var maxSecondPoints=0;
    _.each(badges_data,function(awardee){
        var badgeCount = awardee[1].length;
        if (badgeCount > maxSecondBadges && badgeCount!=maxBadges) maxSecondBadges = badgeCount;
        var pointCount = awardee[2] || parseInt(badgeCount * 1.5) || 1;
        if (pointCount > maxSecondPoints && pointCount!=maxPoints) maxSecondPoints = pointCount;
    });
    var maxThirdBadges=0;
    var maxThirdPoints=0;
    _.each(badges_data,function(awardee){
        var badgeCount = awardee[1].length;
        if (badgeCount > maxThirdBadges && badgeCount!=maxBadges && badgeCount!=maxSecondBadges) maxThirdBadges = badgeCount;
        var pointCount = awardee[2] || parseInt(badgeCount * 1.5) || 1;
        if (pointCount > maxThirdPoints && pointCount!=maxPoints && pointCount!=maxSecondPoints) maxThirdPoints = pointCount;
    });


    //Colorize each badge and apply the right style and text
    _.each(badges_data,function(awardee,i){
        if (i<numToShow){
            var badgeCount = awardee[1].length;
            var pointCount = awardee[2] || parseInt(badgeCount * 1.5) || 1;
            var medalCount = _.toArray(_.groupBy(awardee[1],'badge')).length;

            var bgColor = "white";
            var badge = "";
            var place = "";
            if (pointCount == maxPoints){
                bgColor='gold';
                badge="Gold";
                place="1st";
            } else if (pointCount == maxSecondPoints){
                bgColor='#CCCCCC';
                badge="Silver";
                place="2nd";
            } else if (pointCount == maxThirdPoints){
                bgColor='#E5D8CC';
                badge="Copper";
                place="3rd";
            } else if (!badges.dontHighlightBottom && pointCount == minPoints){
                bgColor='#F1CCCC';
                badge="Last";
            }
            var linesCSS = 'cardHeight100';
            if (medalCount > 12) linesCSS = 'cardHeight300';
            if (medalCount > 8) linesCSS = 'cardHeight200';
            if (medalCount > 4) linesCSS = 'cardHeight150';


            var $person = $person_badge_holders[i]
                .addClass(linesCSS);

            if (bgColor) {
                    $person_badge_holders_text[i]
                        .css('color',bgColor);
            }
            if (place) {
                    $person_badge_holders_text[i]
                        .attr('title',badge+' : '+place+' Place!');
            }

            //Position/tweak left number
            var left = 10;
            var right = 155;
            var fontSize = 0;
            var top = 19;
            if (pointCount > 1000) {
                left += -2;
                right += 0;
                fontSize = 12;
                top = 20;
            } else if (pointCount > 100) {
                left += -6;
                right += -3;
                fontSize = 15;
                top = 18;
            } else if (pointCount > 10) {
                left += -9;
                right += -5;
            }
            $('<span>')
                .addClass('personHeaderCardText personHeaderTextLeft')
                .text('Points:')
                .attr('title','Total Points Achieved')
                .css({left:10, right:155, top:12, fontSize:'7px',textShadow:''})
                .appendTo($person);

            var $points = $('<span>')
                .addClass('personHeaderCardText personHeaderTextLeft')
                .text(pointCount)
                .attr('title','Total Points Achieved')
                .css({left:left, right:right})
                .appendTo($person);
            if (fontSize) $points.css('fontSize',fontSize);
            if (top) $points.css('top',top);


            //Position/tweak right number
            left = 155;
            right = 10;
            fontSize = 0;
            top = 19;
            if (pointCount > 1000) {
                left += 0;
                right += -2;
                fontSize = 12;
                top = 20;
            } else if (pointCount > 100) {
                left += -3;
                right += -6;
                fontSize = 15;
                top = 18;
            } else if (pointCount > 10) {
                left += -5;
                right += -9;
            }
            $('<span>')
                .addClass('personHeaderCardText personHeaderTextRight')
                .text('Badges:')
                .attr('title','Total Points Achieved')
                .css({left:155, right:10, top:12, fontSize:'7px',textShadow:''})
                .appendTo($person);

            var $badges = $('<span>')
                .addClass('personHeaderCardText personHeaderTextRight')
                .text(badgeCount)
                .attr('title','Badges Achieved')
                .css({left:left, right:right})
                .appendTo($person);
            if (fontSize) $badges.css('fontSize',fontSize);
            if (top) $badges.css('top',top);

        }
    });
    if (numToShow<usersCount){
        var $person = $('<span>')
            .addClass('personHeaderCard')
            .appendTo(badges.$holder);

        var numLeft = usersCount-numToShow;
        $('<div>')
            .addClass('personHeaderCardText')
            .html('Additional '+numLeft+'<br/>awardees not shown<br/>...')
            .appendTo($person);

    }
};

badges.groupBadges = function(badges_data){
    var newBadgeData = _.deepClone(badges_data);
    _.each(newBadgeData,function(attendee){
        attendee[1]= _.toArray(_.groupBy(attendee[1],'badge'));
    });
    return newBadgeData;
};

//-----------------------------
$(document).ready(badges.init);