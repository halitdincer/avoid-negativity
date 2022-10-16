
var res = $("body *").contents().map(function(){
    if( this.nodeType == 3 && this.nodeValue.trim() != "")
        return this.nodeValue.trim().split(".");
});

var i = 0;
while(res.length && i < 20) {
    i = i + 1;
    $.ajax({
        url: 'https://api.cohere.ai/classify',
        type: 'post',
        dataType: "json",
        data: JSON.stringify({
            "inputs" : Array.from(res.slice(0, 30)).filter(n => n),
            "model" : "cohere-toxicity"
        }),
        headers: {
            "Authorization": "Bearer ngIhFHVVAWXneht7YJcsRbIWksmP7ejkhKu2woeA",
            "Content-Type": "application/json",
        },
        success: function(data){ 
            data['classifications'].forEach(element => {
                if(element['prediction'] == "TOXIC"){
                    console.log(element['input']);
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

}