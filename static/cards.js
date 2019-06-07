var svg_width = c.getAttribute("width");
var card_width = 108.16;
var x_shift = card_width * 1.5;
var stable_shift = 125;

var opponent_y = 0;
var gen_y = 125 + (stable_shift / 2);
var nursery_y = 325 + (stable_shift / 2);
var discard_y = 225 + (stable_shift / 2);
var player_y = 450 + stable_shift;

var card_coords = function(card, c_x, c_y){
  card.setAttribute("x", c_x);
  card.setAttribute("y", c_y);
}

var card_dimensions = function(card, c_width, c_height){
  card.setAttribute("width", c_width);
  card.setAttribute("height",c_height);
}

var make_card = function(name, type, att){
    // set all the attributes for the cards
    var card = document.createElementNS("http://www.w3.org/2000/svg", "image");
    card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/back.jpg");
    card_dimensions(card, card_width, 150);
    card_coords(card, 0, gen_y);
    card.setAttribute("name", name);
    card.setAttribute("type", type);
    card.setAttribute("att", att);
    card.setAttribute("player", "f") //set player to false
    card.addEventListener("mouseover", function()
        {
            // all card alignment
            if (card.getAttribute("player") == "t") //"t" == true
            {
              card_dimensions(card, card_width * 3, 450);
              card_coords(card, card.getAttribute("x"), player_y - 150);
            }

            var adder = 0
            for (i = 0; i < player_hand.length; i++)
            {
          player_hand[i].setAttribute("x", card_width * i + adder + x_shift);
          player_hand[i].setAttribute("align", "left");

          if (player_hand[i] == card)
          {
              adder = card_width * 2;
          }
            }
        }
       );
    card.addEventListener("mouseout", function()
        {
            // fix card alignment
                              if (card.getAttribute("player") == "t") //"t" == true
          {
            card_dimensions(card, card_width, 150);
            card_coords(card, card.getAttribute("x"), player_y);
            }

            for (i = 0; i < player_hand.length; i++)
            {
		player_hand[i].setAttribute("x", card_width * i + x_shift);
		player_hand[i].setAttribute("align", "left");
            }
        }
			 );
    return card
};


// play a card
async function play(e)
{
    if (mode == "play")
    {
	var card = e.target;
	player_hand = player_hand.filter(function(n) {return n != card}); // removes the played card from the hand

	var i;
	for(i = 0; i < player_hand.length; i++)
	{
	    player_hand[i].setAttribute("x", i * card_width + x_shift);
	}
	var t = card.getAttribute("type");
	console.log(t);
	if (t == "baby_uni" || t == "basic_uni" || t == "magical_uni")
	{
	    card_dimensions(card, card_width, 150);
	    card_coords(card, card.getAttribute("x"), nursery_y);
	    card.setAttribute("player", "f");
	    player_stable.push(card);
	    console.log(card);

	    for(i = 0; i < player_stable.length; i++)
	    {
		player_stable[i].setAttribute("x", i * card_width + x_shift);
	    }
	}else {
	    card_dimensions(card, card_width, 150);
	    card_coords(card, svg_width - card_width, discard_y);
	    card.setAttribute("player", "f");
	    discard_pile.push(card);
	    console.log(card);
	}
	mode = "activate";
	if (t == "magical_uni")
	{
	    await activate(card.getAttribute("att"), "uni");
	}
	else if (t == "magic")
	{
	    await activate(card.getAttribute("att"), "magic");
	}
	if (player_hand.length > 7)
	{
	    turn.innerHTML = "DISCARD A CARD";
	    mode = "discard";
	}
	else
	{
	    turn.innerHTML = "OPPONENT TURN";
	    switch_turns();
	    mode = "draw";
	}
    }
}

async function discard_effect(player) {
  if (player == "player")
  {
    turn.innerHTML = "DISCARD A CARD";
    mode = "discard";
    await check_end();
  }
}

var check_end = function() {
    if(mode != "activate")
    {
	setTimout(check_end(), 100);
    }
    else
    {
	return
    }
}

async function activate(att, type) {
    var x = null;
    if (type == "uni")
    {
	x = JSON.parse(att);
    }
    else
    {
	x = att.split(',');
	for (var i in x)
	{
	    if (x[i] == "draw")
	    {
		await draw("player");
	    }
	    if(x[i] == "discard_all") {
		await discard_effect("player");
	    }
	}
    }
}

var switch_turns = function()
{
    myturn = !myturn;
};

var shift = function(hand){
  var i;
	for(i = 0; i < hand.length; i++)
	{
    hand[i].setAttribute("x", i * card_width + x_shift);
	}
}

var switch_hands = function()
{
  var p_hand = player_hand;
  player_hand = opponent_hand;
  opponent_hand = p_hand;
};

var ret_hand = function(stable, hand, card, card_y)
{
  if (stable.includes(card)) {
    card_coords(card, hand.length * card_width + x_shift, card_y);
    hand.push(card);
  }
  stable = stable.filter(function(n) {return n != card});
  shift(hand);
  console.log("shifted hand");
}

//card_dimensions(card, card_width, 150);
//card_coords(card, card.getAttribute("x"), player_y);
