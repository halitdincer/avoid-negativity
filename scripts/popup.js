const checkbox_enable = document.getElementById('checkbox_enable') ;

chrome.storage.sync.get(['enable'], function(result) {
    checkbox_enable.checked = result.enable;
});

checkbox_enable.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        chrome.storage.sync.set({'enable': true}, function() {
            console.log('Extension Enable is set to ' + "true");
        });
    } else {
        chrome.storage.sync.set({'enable': false}, function() {
            console.log('Extension Enable is set to ' + "false");
        });
    }
});