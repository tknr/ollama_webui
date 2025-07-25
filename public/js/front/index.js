
const Ollama = window.OllamaJS;

const $model = $("#model");
const $input = $('#input');
const $send = $('#send');
const $output = $('#output');


let ollama_instance;

$(function () {
    getModels();
    renderPromptStream();
});

/**
 * @returns string
 * @see https://stackoverflow.com/a/2117523/5584812
 */
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}
/**
 * @return void
 */
function getModels() {
    $.ajax({
        type: "GET",
        url: '/ollama/v1/models',
        dataType: "json"
    }).done(function (json, textStatus, jqXHR) {
        console.log(json, textStatus, jqXHR);
        $model.empty();
        json.data.forEach(function (model) {
            let model_name = model.id.split(':')[0];
            $option = $('<option>')
                .val(model_name)
                .text(model_name);
            $model.append($option);
        });
    }).fail((jqXHR, textStatus, errorThrown) => {
        console.error(jqXHR, textStatus, errorThrown);
    });
}

/**
 * @return void
 */
function renderPromptStream() {
    $send.on("click", async (event) => {
        let OLLAMA_MODEL = $('[name=model]').val();
        
        let input_val = $input.val();
        let right_id = uuidv4();
        $output.prepend(POST_YOU
            .replaceAll('#ID#', right_id)
            .replaceAll('#TEXT#', input_val)
        );
        $('#' + right_id).autosize();
        $('#' + right_id).trigger('autosize.resize');
        $input.val("");

        let left_id = uuidv4();
        $output.prepend(POST_OLLAMA
            .replaceAll('#ID#', left_id)
            .replaceAll('#MODEL#', OLLAMA_MODEL)
            .replaceAll('#TEXT#', '')
        );
        $('#' + left_id).autosize();
        
        ollama_instance = new Ollama({
            model: OLLAMA_MODEL,
            url: "/ollama/api/",
        });
        ollama_instance.prompt_stream(input_val, function (error, response) {
            if (error) {
                console.error(error)
            }
            else if (response.done) {
                // console.log('response.done:' + response.done);
            }
            else {
                console.log(response);
                $('#' + left_id).val($('#' + left_id).val() + response.response);
                $('#' + left_id).trigger('autosize.resize');
            }
        });
    });
}

/**
 * post : you
 * @var string
 */
const POST_YOU = `
<div class="row py-1">
    <div class="col float-end">
        <div class="row">YOU</div>
        <div clas="row">
                <textarea class="form-control" id="#ID#" rows="1" readonly>#TEXT#</textarea>
        </div>
    </div>
    <div class="col-auto text-center my-3"><i class="fa-solid fa-user fa-2xl"></i></div>
</div>
`;

/**
 * post : ollama
 * @var string
 */
const POST_OLLAMA = `
<div class="row py-1">
    <div class="col-auto text-center my-3"><i class="fa-solid fa-robot fa-2xl"></i></div>
    <div class="col float-end">
        <div class="row">#MODEL#</div>
        <div class="row">
                <textarea class="form-control" id="#ID#" rows="1" readonly>#TEXT#</textarea>
        <div>
    </div>
</div>
`;

