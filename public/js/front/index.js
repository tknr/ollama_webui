$(document).ready(function () {
    let lastResponseLength = false;
    let ajaxRequest = $.ajax({
        type: 'get',
        url: '/ollama/',
        data: {},
        dataType: 'json',
        processData: false,
        xhrFields: {
            // Getting on progress streaming response
            onprogress: function(e)
            {
                console.log(e)
                let response = e.currentTarget.response;
                console.log(response)
                $('#test').text(response);
            }
        }
    });

    // On completed
    ajaxRequest.done(function(data)
    {
        console.log('Complete response = ' + data);
    });

    // On failed
    ajaxRequest.fail(function(error){
        console.log('Error: ', error);
    });

    console.log('Request Sent');
});


/**
 * [tknr@server ~]$ curl http://l.tknr.com/ollama/
Ollama is running[tknr@server ~]$ curl http://l.tknr.com/ollama/v1/models
{"object":"list","data":[{"id":"granite3-dense:latest","object":"model","created":1746602518,"owned_by":"library"},{"id":"codellama:latest","object":"model","created":1746174524,"owned_by":"library"},{"id":"phi4:latest","object":"model","created":1743577137,"owned_by":"library"}]}
[tknr@server ~]$ curl https://s.tknr.com/ollama/v1/models
{"object":"list","data":[{"id":"granite3-dense:latest","object":"model","created":1746602518,"owned_by":"library"},{"id":"codellama:latest","object":"model","created":1746174524,"owned_by":"library"},{"id":"phi4:latest","object":"model","created":1743577137,"owned_by":"library"}]}
[tknr@server ~]$ 
 */