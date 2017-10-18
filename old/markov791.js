// Reading input 

var reader;
function readFileAndDisplay(evt) {
  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0]; 

  if (f) {
    console.log("Got file");
    var r = new FileReader();
    r.readAsText(f);
    r.onload = function(e) { 
      var contents = e.target.result;
      console.log( "Got the file.\n" 
            +"name: " + f.name + "\n"
            +"type: " + f.type + "\n"
            +"size: " + f.size + " bytes\n"
            + "starts with: " + contents.substr(0, contents.indexOf("\n"))
      );  
      reader = r;
      source = reader.result;
     // console.log("New source: "+source);
      document.getElementById("source").innerHTML = JSON.stringify(source);
    }
  } else { 
    alert("Failed to load file");
  }
}



// UI stuff
window.onload = function() {

var generateButton = document.getElementById("generateButton");
generateButton.addEventListener("click", function () {
  var generated = generate(); 
  document.getElementById("generated").innerHTML = generated;
});

document.getElementById('source').innerHTML = source;
document.getElementById('fileinput').addEventListener('change', readFileAndDisplay, false);
}

// Utils

function tokenize(s) {
  return s.split(/\s+/);
}

// Random element of an array "lst"
function choose_random(lst) {
  // if(lst == undefined) {return ""}
  var idx = Math.floor(Math.random() * lst.length);
  return lst[idx];
}


function take_n(n, array, index) {
  var slice = [];
  while (index < array.length && n > 0) {
    slice.push(array[index]);
    index++;
    n--;
  }
  return slice;
}

// n.b.: returns "undefined" if index is out of bounds
function after(n, array, index) {
  return array[index+n];
}

// Key-value stores

function array_equal(a1, a2) {
  if (a1 == null || a2 == null) {
    if(a1 == null && a2 == null) {
      return true;
    }
    return false;
  }
  if (a1.length != a2.length) {
    return false;
  }
  for(var i = 0; i < a1.length; i++) {
    if (a1[i] != a2[i]) {
      return false;
    }
  }
  return true;
}

// {key: (some array), value: (some array)}

function lookup(map, key) {
  for (var i = 0; i < map.length; i++) {
    var entry = map[i];
    if (array_equal(entry.key, key)) {
      return entry.value;
    }
  }
  return undefined;
}

function add(map, key, value) {
  var entry = lookup(map, key);
  if (entry == undefined) {
    map.push({key: key, value: [value]});
  } else { 
    entry.push(value);
  }
}

// Markov Generator

var source =
 "I think that I will think of the will that I wrote."

token_table = [];


// Input: n, a history length in # of tokens
//        tokens, a sequence of corpus tokens
// Output: Mapping from n-grams to "weighted sets" of possible next tokens.
// Example: build_map(1, ["a", "b", "a", "c"])
// Output:
//  [
//    {key: ["a"], value: [ "b", "c"]}
//    {key: ["b"], value: [ "a" ]}
//    {key: ["c"], value: [] }
//  ]
function build_map(n, tokens) {
  var map = [];

  for (var i = 0; i < tokens.length; i++) {
    var key = [];
    for (var j = 0; j < n; j++) {
      key.push(tokens[i+j]);
    }
    var value = tokens[i+n];
    add(map, key, value);
  }

  return map;
}

// Input: corpus : string array
// Output: an array of {key, value} entries mapping n-grams to
//  "weighted sets" of possible next tokens.
function map_from(corpus) {
  return build_map(1, corpus);
}

// Given a preceding token "prev", return a possible next token with the
// same probability distribution as the source text.
function generate_next(prev) {
  var choices = lookup(token_table, [prev]);
  if (choices == undefined) {
    return "";
  } else {
    return choose_random(choices);
  }
}

/* generate_from : int * string -> string
 * Input: (length * seed)
 * Output: a string of the provided length in tokens from provided seed. */
function generate_from (length, seed) {
  if (seed == undefined) {
    return "";
  }
  // console.log("Generating a next from seed ["+seed+"]");
  if (length <= 0 || seed == undefined) {
    return seed;
  } else {
    var next = generate_next(seed);
    var rest = generate_from (length - 1, next);
    return seed + " " + rest;
  }
}

/* Generate something same size as the source, starting from the same word
 * as the source. */
function generate () {

  // Generate a table mapping n-grams to tokens from the source text
  var corpus = tokenize(source);
  token_table = map_from(corpus);
  var generated = generate_from(corpus.length-1, corpus[0]);

  return generated;
}



