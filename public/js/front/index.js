$(document).ready(function () {
    $.getJSON("/ollama/", function (data) {
        console.log(data);
        $('#test').text(data);
    });
});


/**
 * [tknr@server ~]$ curl http://l.tknr.com/ollama/
Ollama is running[tknr@server ~]$ curl http://l.tknr.com/ollama/v1/models
{"object":"list","data":[{"id":"granite3-dense:latest","object":"model","created":1746602518,"owned_by":"library"},{"id":"codellama:latest","object":"model","created":1746174524,"owned_by":"library"},{"id":"phi4:latest","object":"model","created":1743577137,"owned_by":"library"}]}
[tknr@server ~]$ curl https://s.tknr.com/ollama/v1/models
{"object":"list","data":[{"id":"granite3-dense:latest","object":"model","created":1746602518,"owned_by":"library"},{"id":"codellama:latest","object":"model","created":1746174524,"owned_by":"library"},{"id":"phi4:latest","object":"model","created":1743577137,"owned_by":"library"}]}
[tknr@server ~]$ 
 */