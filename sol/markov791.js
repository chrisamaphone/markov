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
      // document.getElementById("source").innerHTML = JSON.stringify(source);
      document.getElementById("source").innerHTML = source;
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


// Key-value stores

function lookup(map, key) {
  for (var i = 0; i < map.length; i++) {
    var entry = map[i];
    if (entry.key == key) {
      return entry.value;
    }
  }
  return undefined;
}

// keys map to arrays of possible values
// new keys map to singleton array of value initialized with
// old keys get new values pushed onto the array
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
corpus = [];

function build_table(tokens) {
  for (var i = 0; i < tokens.length - 1; i++) {
    var key = tokens[i];
    var value = tokens[i+1];
    add(token_table, key, value);
  }
}

function select(key) {
  var choices = lookup(token_table, key);
  if (choices == undefined) {
    console.log("No next options for <"+key+">");
    // unseen state
    return choose_random(corpus);
  }
  return choose_random(choices);
}


/* generate : int * string -> string
 * Input: (length * seed)
 * Output: a string of the provided length in tokens from provided seed. */
function generate_from (length, seed) {
  if (length == 0) {
    return seed;
  } else {
    var next = select(seed);
    var rest = generate_from(length - 1, next);
    return seed+" "+rest;
  }
}

/* Generate something same size as the source, starting from the same word
 * as the source. */
function generate () {
  source = document.getElementById("source").value;
  corpus = tokenize(source);
  build_table(corpus);
  var generated = generate_from(corpus.length-1, corpus[0]);
  return generated;
}



