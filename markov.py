#!/usr/bin/python

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

# sort over the array input_tokens and associate prev->next tokens in our
# map "token_table"
