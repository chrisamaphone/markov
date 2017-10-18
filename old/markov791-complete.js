var source =
 "The cat looked at the dog. The dog looked sleepy. The cat yawned. A dog yawned."

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

function after(n, array, index) {
  return array[index+n];
}

/* Key-value stores */

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

function build_map(n, tokens) {
  var map = [];
  for (var i = 0; i < tokens.length; i++) {
    var key = take_n(n, tokens, i);
    var value = after(n, tokens, i);
    if (value != undefined) {
      add(map, key, value);
    }
  }
  return map;
}

/* Make a Markov map */
function map_from(corpus) {
  return build_map(1, corpus);
}

function select(map, key) {
  var choices = lookup(map, [key]);
  if (choices == undefined) {
    console.log("No next options for ["+key+"]");
    return "";
  }
  var choice = choose_random(choices);
  return choice;
}

/* Reading input */

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


/* ***** */
token_table = [];

function generate_next (prev) {
  //console.log("Previous token: [" +prev+"]");
  var next = select(token_table, prev);
  if (next == undefined || next == "") {
    console.log("Couldn't generate next from "+prev);
    return "";
  }
  return next;
}

/* generate : int * string -> string
 * Input: (length * seed)
 * Output: a string of the provided length in tokens from provided seed. */
function generate_from (length, seed) {
  if (length == 0 || seed == "") {
    return seed;
  } else {
    var next = generate_next(seed);
    var rest = generate_from(length - 1, next);
    return seed+" "+rest;
  }
}

/* Generate something same size as the corpus */
function generate () {
  if (reader != null) {
    source = reader.result;
  }
  // Otherwise, source is default string :)
  
  // generate a table from n-grams to tokens from the corpus
  var corpus = tokenize(source);
  token_table = map_from(corpus);

  var generated = generate_from(corpus.length-1, corpus[0]);

  return generated;
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
