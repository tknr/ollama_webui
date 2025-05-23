
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

    $send.on("click", async (event) => {
        let input_val = $input.val();
        let right_id = uuidv4();
        $output.prepend(POST_RIGHT.replaceAll
            ('#ID#', right_id)
            .replaceAll('#TEXT#', input_val)
        );
        $input.val("");

        let left_id = uuidv4();
        $output.prepend(POST_LEFT.replaceAll
            ('#ID#', left_id)
            .replaceAll('#TEXT#', '')
        );

        if (ollama_instance == null) {
            ollama_instance = new Ollama({
                model: $('[name=model]').val(),
                url: "/ollama/api/",
            });
        }
        await ollama_instance.prompt_stream(input_val, function (error, response) {
            if (error) {
                console.error(error)
            }
            else if (response.done) {
                console.log('response.done:' + response.done);
            }
            else {
                console.log(response);
                $('#' + left_id).html($('#' + left_id).html() + response.response.replace('\n', '<br />'));
            }
        });


    });
}

/**
 * 右
 * @var string
 */
const POST_RIGHT = `
<div class="row">
    <div class="col-1">&nbsp;</div>
    <div class="col-auto border border-1 rounded float-end p-2" id="#ID#">
        #TEXT#
    </div>
</div>
`;

/**
 * 左
 * @var string
 */
const POST_LEFT = `
<div class="row">
    <div class="col-auto border border-1 rounded float-end p-2" id="#ID#">
        #TEXT#
    </div>
    <div class="col-1">&nbsp;</div>
</div>
`;