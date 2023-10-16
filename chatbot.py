import openai
import sys
import ast

openai.api_key = "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"

# messages = [{"role": "system", "content": "You are a helpful assistant."},]

def chatbot(messages):
    messages_list = ast.literal_eval(messages)

    # Request gpt-3.5-turbo for chat completion
    response = openai.ChatCompletion.create(model="gpt-3.5-turbo",messages=messages_list)

    # # Print the response and add it to the messages list
    chat_message = response['choices'][0]['message']['content']
    print(chat_message)

if __name__ == "__main__":
  chatbot(sys.argv[1])