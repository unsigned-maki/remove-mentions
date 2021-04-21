const { React } = require('powercord/webpack');
const { SwitchItem } = require('powercord/components/settings');

module.exports = ({ getSetting, toggleSetting }) => (
  <div>
  	<SwitchItem note="Remove mention badges next to channels." value={getSetting("channelBadges", false)} onChange={() => toggleSetting("channelBadges")}>
      Remove Channels Badges
    </SwitchItem>
    <SwitchItem note="Remove mention badges next to server icons." value={getSetting("serverBadges", false)} onChange={() => toggleSetting("serverBadges")}>
      Remove Server Badges
    </SwitchItem>
  </div>
);
