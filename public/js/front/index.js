
const Ollama = window.OllamaJS;

const $model = $("#model");
const $input = $('#input');
const $send = $('#send');
const $output = $('#output');


let ollama_instance;

$(function () {
    console.log("ready");
    getModels();
    renderPromptStream();

});

/**
 * @return void
 */
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

/**
 * @return void
 */
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

    $send.on("click", async (event) => {
        if (ollama_instance == null) {
            ollama_instance = new Ollama({
                model: $('[name=model]').val(),
                url: "/ollama/api/",
            });
        }
        await ollama_instance.prompt_stream($input.val(), on_response)
        $input.val("")
    });
}