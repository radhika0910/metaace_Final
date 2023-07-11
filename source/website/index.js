import { SetExternalLibLocation } from '../engine/io/externallibs.js';
import { Embed } from './embed.js';
import { Website } from './website.js';
import { SetEventHandler, HandleEvent } from './eventhandler.js';
import { PluginType, RegisterPlugin } from './pluginregistry.js';
import { ButtonDialog, ProgressDialog } from './dialog.js';
import { ShowMessageDialog } from './dialogs.js';
// import { login } from './login.js';
import * as Engine from '../engine/main.js';
// import { connectToDatabase } from './db.js'; // Import the connectToDatabase function

export { Engine };

import './css/icons.css';
import './css/themes.css';
import './css/core.css';
import './css/controls.css';
import './css/dialogs.css';
import './css/treeview.css';
import './css/panelset.css';
import './css/navigator.css';
import './css/sidebar.css';
import './css/website.css';

import './css/embed.css';

export const UI = {
    ButtonDialog,
    ProgressDialog,
    ShowMessageDialog,
    HandleEvent,

};

export function SetWebsiteEventHandler(eventHandler) {
    SetEventHandler(eventHandler);
}

export function RegisterHeaderPlugin(plugin) {
    RegisterPlugin(PluginType.Header, plugin);
}

export function RegisterToolbarPlugin(plugin) {
    RegisterPlugin(PluginType.Toolbar, plugin);
}

export function StartWebsite(externalLibLocation) {
    SetExternalLibLocation(externalLibLocation);
    window.addEventListener('load', async () => {
        // Connect to the database
        // const connection = await connectToDatabase();


        // if (connection)


            let website = new Website({
                headerDiv: document.getElementById('header'),
                headerButtonsDiv: document.getElementById('header_buttons'),
                toolbarDiv: document.getElementById('toolbar'),
                mainDiv: document.getElementById('main'),
                introDiv: document.getElementById('intro'),
                fileNameDiv: document.getElementById('main_file_name'),
                leftContainerDiv: document.getElementById('main_left_container'),
                navigatorDiv: document.getElementById('main_navigator'),
                navigatorSplitterDiv: document.getElementById('main_navigator_splitter'),
                rightContainerDiv: document.getElementById('main_right_container'),
                sidebarDiv: document.getElementById('main_sidebar'),
                sidebarSplitterDiv: document.getElementById('main_sidebar_splitter'),
                viewerDiv: document.getElementById('main_viewer'),
                fileInput: document.getElementById('open_file')
            });
            website.Load();


        // else

            console.log('Database connection failed');

    });
}

export function StartEmbed(externalLibLocation) {
    SetExternalLibLocation(externalLibLocation);
    window.addEventListener('load', () => {
        let embed = new Embed({
            viewerDiv: document.getElementById('embed_viewer'),
            websiteLinkDiv: document.getElementById('website_link')
        });
        embed.Load();
    });
}
