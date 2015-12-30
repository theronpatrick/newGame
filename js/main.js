$(document).ready(function() {
    console.log("sup1");

    function init() {
        initFastClick();
        initCards();
        attachHandlers();
    }

    function initFastClick() {
        $(function() {
            FastClick.attach(document.body);
        });
    }

    var deck = [];
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
                    description: this["gsx$description"]["$t"]
                });
            });

            console.log("cards are" , deck);

            shuffle(deck);
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
            $(domCards[i]).find("p").text(card.description);

        }

        console.log("deck now is " , deck);
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
    }

    init();
});
