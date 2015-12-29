$(document).ready(function() {
    console.log("sup");

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
})
