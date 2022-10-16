
// Create a list of every sentences in the body 
var res = $("body *").contents().map(function(){
    // if node is a text node and it is not empty and length is less than 500
    if( this.nodeType == Node.TEXT_NODE && this.nodeValue.trim() != "" && this.length < 500)
        return this.nodeValue.trim().split(/[."-]/) ; // .split(/((\S+ ){4}\S+)|(\S+( \S+)*)(?= *\n|$)|\S+/g)
});

// Remove duplicates sentences
res = Array.from(new Set(res));

// iterate through at sentences list in batches of 30
var i = 0;
while(i + 30 < res.length) {
    
    // TEST: console.log(res.slice(i, i+30));
    
    // maka ajax request with 30 sentences batch
    $.ajax({
        url: 'https://api.cohere.ai/classify',
        type: 'post',
        dataType: "json",
        data: JSON.stringify({
            "inputs" : res.slice(i, i+30).filter(n => n),
            "model" : "cohere-toxicity"
        }),
        headers: {
            "Authorization": "Bearer ngIhFHVVAWXneht7YJcsRbIWksmP7ejkhKu2woeA",
            "Content-Type": "application/json",
        },
        success: function(data){ 

            // iterate through every sentences in the result json
            data['classifications'].forEach(element => {

                // log the prediction and sentences
                console.log(element['prediction'] + " --- " + element['input']);

                // if the prediction is toxic
                if(element['prediction'] == "TOXIC"){

                    // find the sentences and wrap around with censor class
                    $("body:contains('"+element['input']+"')").html(function(_, html) {
                        return html.split(element['input']).join("<span class='censor'>" + element['input'] +  "</span>");
                    });
                }
            });
        },
        error: function(req, err){ console.log('Error:' + err); }
    }).catch(function (error) {
        console.log(error);
    });

    i = i + 30;
}