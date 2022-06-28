import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from transformers import AutoModelForCausalLM, AutoTokenizer


def get_model():
    model = AutoModelForCausalLM.from_pretrained(model_source)
    tokenizer = AutoTokenizer.from_pretrained(model_source)
    tokenizer.pad_token = tokenizer.eos_token
    return (model, tokenizer)


def generate_solution(model, tokenizer, question):
    prompt = question
    input_ids = tokenizer(prompt, return_tensors="pt").input_ids
    start = len(input_ids[0])
    output = model.generate(
        input_ids,
        max_new_tokens=36,
        do_sample=True,
        top_p=0.95,
        pad_token_id=tokenizer.pad_token_id,
        eos_token_id=tokenizer.eos_token_id,
        early_stopping=True,
        temperature=0.8,
        num_beams=3,
        no_repeat_ngram_size=3,
        repetition_penalty=None,
        num_return_sequences=3,
        return_full_text=False,
    )
    out_list = []
    for i, sample_output in enumerate(output):
        output_str = tokenizer.decode(
            sample_output[start:], skip_special_tokens=True
        ).strip()
        out_list.append(output_str)
    return out_list


class Resquest(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        buf = '''Hello World'''
        self.wfile.write(buf.encode())

    def do_POST(self):
        path = self.path
        print(path)
        question = self.rfile.read(
            int(self.headers['content-length'])).decode()
        print(question)
        self.send_response(200)
        self.send_header("Content-type", "application/json; charset=utf-8")
        self.end_headers()
        res = generate_solution(model, tokenizer, question)
        print(res)
        html = json.dumps(res)
        self.wfile.write(html.encode())


model_dir = "../model/"
model_name = "gpt-neo-125M-code-clippy-dedup-2048"
model_source = model_dir + model_name
host = ('localhost', 8888)
model, tokenizer = get_model()
server = HTTPServer(host, Resquest)
print("Starting server, listen at: %s:%s" % host)
server.serve_forever()
