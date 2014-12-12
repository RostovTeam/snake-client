(function (container) {
    
    container.reasons = {
        clientDisconnect: 'client_leave_room',
        endedGame: 'game_ended'
    };

    container.languages = {
        native: [{label:'fr',name:'Français'},{label:'de',name:'Deutsch'},{label:'en',name:'English'},{label:'ru', name:'Russian'}],
        learning: [{label:'fr',name:'Français'},{label:'de',name:'Deutsch'},{label:'en',name:'English'}]
    };
})(typeof window !== 'undefined' ? window : module.exports);