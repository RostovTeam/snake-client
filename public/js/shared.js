(function (container) {
    
    container.reasons = {
        clientDisconnect: 'client_leave_room',
        endedGame: 'game_ended'
    };

})(typeof window !== 'undefined' ? window : module.exports);