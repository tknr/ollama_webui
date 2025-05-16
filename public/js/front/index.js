
const Ollama = window.OllamaJS;
const ollama_instance = new Ollama({
    model: "phi4",
    url: "/ollama/api/",
});

const $input = $('#input');
const $output = $('#output');

const on_response = (error, response) => {
    if (error) {
        console.error(error)
    }

    else if (response.done) {
        // done!
    }
    else {
        console.log(response);
        $output.text($output.text() + response.response);
    }
}

$input.on("keyup", async (event) => {
    if (event.key === "Enter") {
        await ollama_instance.prompt_stream($input.val(), on_response)
        $input.val("")
    }
});




/**
 * [tknr@server ~]$ curl http://l.tknr.com/ollama/
Ollama is running[tknr@server ~]$ curl http://l.tknr.com/ollama/v1/models
{"object":"list","data":[{"id":"granite3-dense:latest","object":"model","created":1746602518,"owned_by":"library"},{"id":"codellama:latest","object":"model","created":1746174524,"owned_by":"library"},{"id":"phi4:latest","object":"model","created":1743577137,"owned_by":"library"}]}
[tknr@server ~]$ curl https://s.tknr.com/ollama/v1/models
{"object":"list","data":[{"id":"granite3-dense:latest","object":"model","created":1746602518,"owned_by":"library"},{"id":"codellama:latest","object":"model","created":1746174524,"owned_by":"library"},{"id":"phi4:latest","object":"model","created":1743577137,"owned_by":"library"}]}
[tknr@server ~]$ 
 */