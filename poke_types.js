// Stores the indexes of selected types, -1 indicates no selection
let selectedTypes = [null, null];
let types = ["Normal", "Fighting", "Flying", "Poison", "Ground",
            "Rock", "Bug", "Ghost", "Steel", "Fire", "Water",
            "Grass", "Electric", "Psychic", "Ice", "Dragon",
            "Dark", "Fairy"];
// typeWeaknessIndexes[i][j] indicates the damage multiplier for damage of
// types[j] on types[i], for example:
// types[0], Normal, takes double damage from types[1], Fighting, as
// indicated by typeWeaknessIndexes[0][1]
let typeWeaknessIndexes = [[1,2,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
  [1,1,2,1,1,0.5,0.5,1,1,1,1,1,1,2,1,1,0.5,2],
  [1,0.5,1,1,0,2,0.5,1,1,1,1,0.5,2,1,2,1,1,1],
  [1,0.5,1,0.5,2,1,0.5,1,1,1,1,0.5,1,2,1,1,1,0.5],
  [1,1,1,0.5,1,0.5,1,1,1,1,2,2,0,1,2,1,1,1],
  [0.5,2,0.5,0.5,2,1,1,1,2,0.5,2,2,1,1,1,1,1,1],
  [1,0.5,2,1,0.5,2,1,1,1,2,1,0.5,1,1,1,1,1,1],
  [0,0,1,0.5,1,1,0.5,2,1,1,1,1,1,1,1,1,2,1],
  [0.5,2,0.5,0,2,0.5,0.5,1,0.5,2,1,0.5,1,0.5,0.5,0.5,1,0.5],
  [1,1,1,1,2,2,0.5,1,0.5,0.5,2,0.5,1,1,0.5,1,1,0.5],
  [1,1,1,1,1,1,1,1,0.5,0.5,0.5,2,2,1,0.5,1,1,1],
  [1,1,2,2,0.5,1,2,1,1,2,0.5,0.5,0.5,1,2,1,1,1],
  [1,1,0.5,1,2,1,1,1,0.5,1,1,1,0.5,1,1,1,1,1],
  [1,0.5,1,1,1,1,2,2,1,1,1,1,1,0.5,1,1,2,1],
  [1,2,1,1,1,2,1,1,2,2,1,1,1,1,0.5,1,1,1],
  [1,1,1,1,1,1,1,1,1,0.5,0.5,0.5,0.5,1,2,2,1,2],
  [1,2,1,1,1,1,2,0.5,1,1,1,1,1,0,1,1,0.5,2],
  [1,0.5,1,2,1,1,0.5,1,2,1,1,1,1,1,1,0,0.5,1]];
let typeButtonsBox = $("#TypeButtonsBox");

// Creates type buttons
for(let i = 0; i < types.length; i++) {
  typeButtonsBox.append('<button class="Button" id="' + types[i] + '">' + types[i] + '</button>');
}

// Get type index from String identifier
function getTypeIndex(identifier) {
  let index = 0;
  for(index; index < types.length; index++) {
    if(identifier === types[index]) {
      return index;
    };
  };
};

function numberOfTypesSelected() {
  let count = 0;
  if(selectedTypes[0]) { count++ };
  if(selectedTypes[1]) { count++ };
  return count;
};

let typeButtons = $("#TypeButtonsBox button");

typeButtons.click(function() {
  let selectedButton = $(this).attr("id");

  // Deactivate a button if it is currently selected
  if(selectedTypes[0] === selectedButton) {
    deactivateButton(this, 0);
  } else if(selectedTypes[1] === selectedButton) {
    deactivateButton(this, 1);
  } // Check that <= 2 selections are made
  else if(numberOfTypesSelected() === 2) {
    $("#TypeSelectionError").html("Please only select at most 2 types.").css("color", "red");
  } // Set button to active
  else {
    $("#TypeSelectionError").html("");
    if(!selectedTypes[0]) {
      selectedTypes[0] = selectedButton;
    } else {
      selectedTypes[1] = selectedButton;
    }
    $(this).toggleClass("active");
  }
});

function deactivateButton(button, index) {
  $("#TypeSelectionError").html("");
  selectedTypes[index] = null;
  $(button).toggleClass("active");
}

let clearButton = $("#TypeButtonsSection #ClearButton");

clearButton.click(function() {
  typeButtons.removeClass("active");
  $("#TypeWeaknesses").html("");
  selectedTypes[0] = null;
  selectedTypes[1] = null;
});

function getWeaknesses() {
  let weaknesses = [];
  for(let i = 0; i < types.length; i++) {
    weaknesses[i] = 1;
  };
  for(let i = 0; i < selectedTypes.length; i++) {
    if(selectedTypes[i]) {
      let index = getTypeIndex(selectedTypes[i]);
      for(let j = 0; j < types.length; j++) {
        weaknesses[j] *= typeWeaknessIndexes[index][j];
      };
    };
  };
  return weaknesses;
};

function generateWeaknessTable() {
  let weaknessTable = "";
  let weaknesses = getWeaknesses();
  weaknessTable += '<table id="WeaknessTable"><tr>';
  for(let i=0; i < types.length; i++) {
    weaknessTable += "<th>" + types[i] + "</th>";
  };
  weaknessTable += "<tr>";
  // Highlight the damage multiplier based on its value
  for(let i=0; i < types.length; i++) {
    switch(weaknesses[i]) {
      case 0:
        weaknessTable += '<td style="background-color:black;color:white;">';
        break;
      case 0.25:
      weaknessTable += '<td style="background-color:blue;color:white;">';
      break;
      case 0.5:
        weaknessTable += '<td style="background-color:purple;color:white;">';
        break;
      case 2:
        weaknessTable += '<td style="background-color:yellow;color:black;">';
        break;
      case 4:
        weaknessTable += '<td style="background-color:red;color:white;">';
        break;
      default:
        weaknessTable += '<td>';
    };
    weaknessTable  += weaknesses[i] + "x</td>";
  };
  weaknessTable += "<tr><table>";
  return weaknessTable;
};

let weaknesses = $("#getWeaknesses");

weaknesses.click(function() {
  if(numberOfTypesSelected() === 0) {
    $("#TypeSelectionError").html("Please select at least one type.").css("color", "red");
  } else {
    $("#TypeSelectionError").html("");
    let weaknessTable = $("#TypeWeaknesses");
    weaknessTable.html(generateWeaknessTable());
  }
});
