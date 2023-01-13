
chrome.storage.sync.get(['enable'], function(result) {


    if(result.enable == true){

        // Create a list of every sentences in the body 
        var word_blocks = $("body *").contents().map(function(){
            // if node is a text node and it is not empty and length is less than 500
            if( this.nodeType == Node.TEXT_NODE && this.nodeValue.trim() != "" && this.length < 500)
                return this.nodeValue.trim().split(/[."-]/) ; // .split(/((\S+ ){4}\S+)|(\S+( \S+)*)(?= *\n|$)|\S+/g)
        });

        // Remove duplicates sentences
        word_blocks = Array.from(new Set(word_blocks));

        // Remove word_block less than 4 letters
        word_blocks = word_blocks.filter(function(word_block) { 
            return word_block.length > 4;
        });

        console.log(word_blocks);

        // The minimum prediction confidence.
        const threshold = 0.7;
        
        // Load the model
        toxicity.load(threshold).then(model => {

          // Use toxicity model to classify each word block in word_blocks
          model.classify(word_blocks).then(predictions => {

            predictions[6]['results'].forEach(function callback(element, index) {

                  // if the prediction is toxic
                  if(element['match']){

                    // find the sentences and wrap around with censor class
                    $("body:contains('"+word_blocks[index]+"')").html(function(_, html) {
                        return html.split(word_blocks[index]).join("<span class='censor'>" + word_blocks[index] +  "</span>");
                    });

                  }
              });

          });

        });


    } // End of "if(result.enable == true)"

}); // End of "chrome.storage.sync.get"


// Remove the censor span with double click on the word block.
$('span').dblclick(function(event) {
    $(this).toggleClass('censor');
});

