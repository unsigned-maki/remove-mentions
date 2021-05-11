const { Plugin } = require("powercord/entities");

const Settings = require('./Settings');

const INTERVAL = 1000; // interval in which pings are cleared (milliseconds)

let interval;
let cssRules;
let htmlTags;

module.exports = class RemoveMentions extends Plugin
{
    findCssRules()
    {
    	var styleSheetRules;
		
		for (let j = 0; j < document.styleSheets.length; j++)
    	{
    		try { styleSheetRules = document.styleSheets[j].cssRules; } catch { continue; };

    		for (let i = 0; i < styleSheetRules.length; i++)
    		{
    			if ("selectorText" in styleSheetRules[i])
    			{
	    			if (styleSheetRules[i]["selectorText"].includes("lowerBadge") && !styleSheetRules[i]["selectorText"].includes("upperBadge"))
	    			{
	    				cssRules[0] = styleSheetRules[i]["selectorText"].replace(".", "");
	    			}
                    else if (styleSheetRules[i]["selectorText"].includes("unreadMentionsBar") && !styleSheetRules[i]["selectorText"].includes("unreadMentionsIndicator"))
                    {
                        cssRules[1] = styleSheetRules[i]["selectorText"].replace(".", "").replace("::before", "");
                    }
                    else if (styleSheetRules[i]["selectorText"].includes("unreadBar") && !styleSheetRules[i]["selectorText"].includes("unreadBottom") && !styleSheetRules[i]["selectorText"].includes("unreadTop"))
                    {
                        cssRules[2] = styleSheetRules[i]["selectorText"].replace(".", "").replace("::before", "");
                    }
                    else if (styleSheetRules[i]["selectorText"].includes("mentionsBadge"))
                    {
                        cssRules[3] = styleSheetRules[i]["selectorText"].replace(".", "");
                    }
    			}
    		}
    	}
    }

    findHtmlTags()
    {
        var elements;
        elements = document.getElementsByTagName("*");

        for (let i = 0; i < elements.length; i++)
        {
            if (elements[i].id.includes("lower_badge_masks"))
            {
                htmlTags[0] = elements[i].tagName;
                return;
            }
        }        
    }

    hideChannelBadges(toggle)
    {
        var elements;

        for (let j = 2; j < 4; j++)
        {
            elements = document.getElementsByClassName(cssRules[j]);

            for (let i = 0; i < elements.length; i++) 
            {
                elements[i].style.visibility = toggle ? "hidden" : "visible";
            }
        }
    }

    hideServerBadges(toggle)
    {
    	var elements;

        for (let j = 0; j < document.getElementsByClassName(cssRules[0]).length; j++)
        {
            elements = document.getElementsByTagName(htmlTags[0]);

            for (let i = 0; i < elements.length; i++)
            {
                if (elements[i].id.includes("lower_badge_masks"))
                {
                    elements[i].style.visibility = toggle ? "hidden" : "visible";
                }
            }

            document.getElementsByClassName(cssRules[0])[j].style.visibility = toggle ? "hidden" : "visible";
        }

        elements = document.getElementsByClassName(cssRules[1]);

        for (let i = 0; i < elements.length; i++) 
        {
            elements[i].style.visibility = toggle ? "hidden" : "visible";
        }
	}

    startPlugin()  
    {
    	cssRules = ["", "", "", ""];
        htmlTags = [""]

	    powercord.api.settings.registerSettings(this.entityID, {
	      category: this.entityID,
	      label: "Remove Mentions",
	      render: Settings
	    });

    	this.findCssRules();
        
        window.addEventListener("load", this.findHtmlTags);

        interval = setInterval(function(plugin) {
            plugin.hideChannelBadges(plugin.settings.get("channelBadges", true));
            plugin.hideServerBadges(plugin.settings.get("serverBadges", true));
        }, INTERVAL, this);
    }

    pluginWillUnload()
    {
    	powercord.api.settings.unregisterSettings(this.entityID);
    	clearInterval(interval);
        this.hideChannelBadges(false);
        this.hideServerBadges(false);
    }
};
