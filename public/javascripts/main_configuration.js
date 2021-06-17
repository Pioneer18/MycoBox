// Hide or Display the Overrides
function acceptDefaults () {
    console.log("applying event listeners to accept_defaults")
    let rad = document.main_config_form.accept_defaults;
    console.log(rad);
    let prev = null;
    const overrides = document.getElementById('overrides');
    for (let i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', function() {
            if ( rad[i].value == 'Yes') {
                overrides.classList.add('hidden');
            } 
            if ( rad[i].value !== 'Yes') {
                overrides.classList.remove('hidden');
            }
        });
    }
}

acceptDefaults();