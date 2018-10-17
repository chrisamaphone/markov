#!/usr/bin/python3
import random

# Read test-input.txt, save its contents as input_text, print its contents
# and close the file.

input_file = open("test-input.txt");
input_text = input_file.read();
print(input_text);
input_file.close();

# Tokenize input
input_tokens = input_text.split();


# for tok in input_tokens:
  # print(tok);

token_table = {};

# sort over the array input_tokens and associate prev->next tokens in our
# map "token_table"
for i in range(0, len(input_tokens)-2):
    tok = input_tokens[i];
    tok2 = input_tokens[i+1];
    token_table[tok] = token_table.get(tok, []);
    token_table[tok].append(tok2);
    print("Added " + tok2 + " to " + tok + "'s successors"); 

print(token_table);

def get_random(arr):
    return arr[random.randint(0,len(arr)-1)];

def generate(start, n):
    generated = start;
    current = start;
    for i in range(1,n):
        nexts = token_table.get(current, []);
        if len(nexts) == 0:
           # print("No successor for " + current);
           current = get_random(token_table.keys());
        else:
            current = get_random(nexts);
        generated += " " + current;
    return generated;

print(generate("I", 10));

