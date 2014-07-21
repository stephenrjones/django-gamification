var badges = {$holder:null};
badges.imageUrlPrefix = "/static/";
badges.dontShowBottomPercent = 0.0;
badges.dontHighlightBottom = true;

badges.init = function(){
    //Initialization
    badges.$holder = $("<div>");

    //Move leaderboards around
    $('#leader_board_table').appendTo('#data_graph');
    $('#leader_board').append(badges.$holder);
    if (typeof project_info!="unknown" && project_info.badge_json){
        badges.drawBadgesTable(project_info.badge_json || []);
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

badges.groupBadges = function(badges_data){
    var newBadgeData = _.deepClone(badges_data);
    _.each(newBadgeData,function(attendee){
        attendee[1]= _.toArray(_.groupBy(attendee[1],'badge'));
    });
    return newBadgeData;
};

//-----------------------------
$(document).ready(badges.init);