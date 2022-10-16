
var res = $("body *").contents().map(function(){
    if( this.nodeType == Node.TEXT_NODE && this.nodeValue.trim() != "" && this.length < 500)
        return this.nodeValue.trim().split(/\{10}W/); // 
});

res = Array.from(new Set(res));

var i = 0;
while(i + 5 < res.length) {
    
    
    $.ajax({
        url: 'https://api.cohere.ai/classify',
        type: 'post',
        dataType: "json",
        data: JSON.stringify({
            "inputs" : Array.from(res.slice(i, i+5)).filter(n => n),
            "model" : "cohere-toxicity"
        }),
        headers: {
            "Authorization": "Bearer ngIhFHVVAWXneht7YJcsRbIWksmP7ejkhKu2woeA",
            "Content-Type": "application/json",
        },
        success: function(data){ 
            data['classifications'].forEach(element => {

                console.log(element['prediction'] + " --- " + element['input']);

                if(element['prediction'] == "TOXIC"){
                    $("body:contains('"+element['input']+"')").html(function(_, html) {
                        return html.split(element['input']).join("<span class='censor'>" + String(element['input']) +  "</span>");
                    });
                }
            });
        },
        error: function(req, err){ console.log('Error:' + err); }
    }).catch(function (error) {
        console.log(error);
    });

    i = i + 5;
}