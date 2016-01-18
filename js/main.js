$(document).ready(function() {

    function init() {
        loadTemplates()
        .then(function() {
            initFastClick();
            initGlobals();
            initCards();
            attachHandlers();
        })
        
    }

    function loadTemplates() {

        var deferred = $.Deferred();

        var files = [];

        files.push("test");
        files.push("test2");
        files.push("card");

        var filePromises = [];

        $.each(files, function(key, value) {
            filePromises.push($.get("views/" + value + ".tl"));
        })

        $.when.apply($, filePromises)
        .then(function() {

            $.each(arguments, function(key, value) {
                var source = value[0];
                var name = files[key];
                var compiled = dust.compile(source, name);
                dust.loadSource(compiled);
            })

            deferred.resolve();

        })

        return deferred;
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
            drawThreeCards();

        });
    }

    function drawThreeCards() {

        $(".card-container").empty();
        
        for (var i = 0; i<3; i++) {

            var domCards = $(".card");

            if (deck.length == 0) {
                $(domCards[i]).find("h2").text("Out of cards");
                $(domCards[i]).find("p").text("");
                continue;
            }

            var card = deck.pop();

            dust.render('card', card, function(err, out){ 
                $(".card-container").append(out);
            });
        }

    }

    function drawCard(card) {

        var newCard;
        if (deck.length == 0) {
            newCard = {
                name: "Out of Cards"
            }
            dust.render('card', newCard, function(err, out){ 
                card.empty();
                card.html($(out).html());
            });
            return;
        }

        newCard = deck.pop();

        dust.render('card', newCard, function(err, out){ 
            card.empty();
            card.html($(out).html());
        });
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

        $(".card-container").on("click", ".card", function(e) {

            if ($(e.target).is("button")) {
                cardDiscardHandler(e);
                return;
            }

            cardClickHandler(e);
        })
    }

    function cardClickHandler(e) {
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

        card.removeClass("ready");

        card.animate({
            "opacity": 0
        }, 10, function() {
            drawCard(card);
            card.animate({
                opacity: 1,
            }, cooldown, "easeInQuad", function() {
                showCardReady(card);
            });
        });

    }

    function cardDiscardHandler(e) {

        var card = $(e.target).parents(".card");

        var discardText = $(".discard-text");

        if (card.is(':animated') || discardText.is(":animated")) {
            return;
        }

        card.removeClass("ready");


        card.animate({
            "opacity": 0
        }, 10, function() {
            drawCard(card);
            card.animate({
                opacity: 1,
            }, player.cooldownLength, "easeInQuad");
        });

        discardText.animate({
            "opacity": 0
        }, 10, function() {
            discardText.animate({
                opacity: 1,
            }, player.cooldownLength, "easeInQuad", function() {
                showCardReady(card);
            });
        });

    }

    function showCardReady(card) {
       card.addClass("ready");

       card.animate({
            "background-color": "#87795E"
        }, 150)
        .animate({
            "background-color": "#1F1B15"
        }, 150)
    }

    init();
});
