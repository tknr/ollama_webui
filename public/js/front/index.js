
const Ollama = window.OllamaJS;

const $model = $("#model");
const $input = $('#input');
const $output = $('#output');

let ollama_instance;

$(function () {
    console.log("ready");
    getModels();
    renderPromptStream();

});

function getModels() {
    console.log("getModels");
    $.ajax({
        type: "GET",
        url: '/ollama/v1/models',
        dataType: "json"
    })
        .done(function (json) {
            console.log(json);
            const models = json.data;
            $model.empty();
            models.forEach(function (model) {
                console.log(model);
                $option = $('<option>')
                    .val(model.id.split(':')[0])
                    .text(model.id.split(':')[0]);
                $model.append($option);
            });
        })
        .fail(function () {
            console.log("ajax fail");
        });
}

function renderPromptStream() {
    const on_response = (error, response) => {
        if (error) {
            console.error(error)
        }

        else if (response.done) {
            console.log('response.done:' + response.done);
        }
        else {
            console.log(response);
            $output.text($output.text() + response.response.replace('\n', '<br />'));
        }
    }

    $input.on("keyup", async (event) => {
        if (event.key === "Enter") {
            if (ollama_instance == null) {
                ollama_instance = new Ollama({
                    model: $('[name=model]').val(),
                    url: "/ollama/api/",
                });
            }
            await ollama_instance.prompt_stream($input.val(), on_response)
            $input.val("")
        }
    });
}



/**
 * [tknr@server ~]$ curl http://l.tknr.com/ollama/
Ollama is running[tknr@server ~]$ curl http://l.tknr.com/ollama/v1/models
{"object":"list","data":[{"id":"granite3-dense:latest","object":"model","created":1746602518,"owned_by":"library"},{"id":"codellama:latest","object":"model","created":1746174524,"owned_by":"library"},{"id":"phi4:latest","object":"model","created":1743577137,"owned_by":"library"}]}
[tknr@server ~]$ curl https://s.tknr.com/ollama/v1/models
{"object":"list","data":[{"id":"granite3-dense:latest","object":"model","created":1746602518,"owned_by":"library"},{"id":"codellama:latest","object":"model","created":1746174524,"owned_by":"library"},{"id":"phi4:latest","object":"model","created":1743577137,"owned_by":"library"}]}
[tknr@server ~]$ 
 */