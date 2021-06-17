function acceptDefaults () {
    console.log("applying event listeners to accept_defaults")
    // grab the accept_defaults radio buttons
    var rad = document.main_config_form.accept_defaults;
    console.log(rad);
    var prev = null;
    const overrides = document.getElementById('overrides');
    // loop over both and addEventListener for change
    for (var i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', function() {
            // defaults have been rejected
            console.log("This: ", this);
            if (this !== 'Yes') {
                overrides.classList.add('hidden');
            } 
            if (this == 'Yes') {
                overrides.classList.remove('hidden');
            }
        });
    }
}
// apply event listeners
acceptDefaults();