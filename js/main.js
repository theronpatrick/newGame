$(document).ready(function() {

    function init() {
        initFastClick();
        initGlobals();
        initCards();
        attachHandlers();
    }

    function initFastClick() {
        $(function() {
            FastClick.attach(document.body);
        });
    }

    
    function initGlobals() {
        this.deck = [];
        this.player = {
            score: 0,
            cooldownLength: 3000
        }
        this.gameOver = false;
        refreshScore();
    }

    function refreshScore() {
        $(".point-total").text(player.score);

        if (player.score >= 200 && !gameOver) {
            alert("Awwwww yissss you win!");
            gameOver = true;
        }
    }

    function initCards() {
        // Get cards
        var originalCards;

        var url = "https://spreadsheets.google.com/feeds/list/13EV2ev7_2oIur5C0dq-uo-4w9-jCSvDRKhxNO5gBr9k/od6/public/values?alt=json";

        $.get(url)
        .then(function(response) {
            cards = response.feed.entry;

            $.each(cards, function() {
                deck.push({
                    name: this["gsx$name"]["$t"],
                    description: this["gsx$description"]["$t"],
                    cooldown: this["gsx$cooldown"]["$t"],
                });
            });

            shuffle(deck);
            console.log("deck is " , deck);
            drawThreeCards();

        });
    }

    function drawThreeCards() {
        for (var i = 0; i<3; i++) {

            var domCards = $(".card");

            if (deck.length == 0) {
                $(domCards[i]).find("h2").text("Out of cards");
                $(domCards[i]).find("p").text("");
                continue;
            }

            var card = deck.pop();

            $(domCards[i]).find("h2").text(card.name);
            $(domCards[i]).find(".description").text(card.description);
            $(domCards[i]).find(".cooldown").text("Cooldown: " + card.cooldown + " seconds");

        }

    }

    function drawCard(card) {

        if (deck.length == 0) {
            $(card).find("h2").text("Out of cards");
            $(card).find("p").text("");
            return;
        }

        var newCard = deck.pop();

        $(card).find("h2").text(newCard.name);
        $(card).find(".description").text(newCard.description);
        $(card).find(".cooldown").text("Cooldown: " + newCard.cooldown + " seconds");
    }

    function shuffle(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    function attachHandlers() {
        $(".minus").click(function() {
            var amount = $(this).parent().find("input");
            var value = amount.val();
            value = parseInt(value) - 10;
            amount.val(value);
        })

        $(".plus").click(function() {
            var amount = $(this).parent().find("input");
            var value = amount.val();
            value = parseInt(value) + 10;
            amount.val(value);
        })

        $("input").submit(function(e) {
            e.preventDefault();
        })

        $(".draw-cards").click(function() {
            drawThreeCards();
        })

        $(".new-deck").click(function() {
            initCards();
        })

        $(".card").click(function(e) {
            if ($(e.target).is("button")) {
                return;
            }

            cardClickHandler(e);
        })

        $(".card").find("button").click(function(e) {
            cardDiscardHandler(e);
        })
    }

    function cardClickHandler(e) {
        console.log("in clicky")
        var card = $(e.target);

        if (card.is(':animated')) {
            return;
        }

        var cooldown = card.find(".cooldown").text();
        cooldown = cooldown.replace(" seconds", "");
        cooldown = cooldown.replace("Cooldown: ", "");
        cooldown = parseFloat(cooldown) * 1000;


        var description = card.find(".description").text();

        if (description.search("plus") > -1) {
            description = description.replace("plus ", "");
            description = parseInt(description);
            player.score = player.score + description;
        } else if (description.search("minus") > -1) {
            description = description.replace("minus ", "");
            description = parseInt(description);
            player.score = player.score - description;
        } 

        refreshScore();

        card.animate({
            "opacity": 0
        }, 10, function() {
            drawCard(card);
            card.animate({
                opacity: 1,
            }, cooldown);
        });

    }

    function cardDiscardHandler(e) {

        console.log("in discard");
        var card = $(e.target).parents(".card");

        var discardText = $(".discard-text");

        if (card.is(':animated') || discardText.is(":animated")) {
            console.log("cancelling")
            return;
        }


        card.animate({
            "opacity": 0
        }, 10, function() {
            drawCard(card);
            card.animate({
                opacity: 1,
            }, player.cooldownLength);
        });

        discardText.animate({
            "opacity": 0
        }, 10, function() {
            discardText.animate({
                opacity: 1,
            }, player.cooldownLength, function() {
                console.log("cmon")
            });
        });

    }

    init();
});
