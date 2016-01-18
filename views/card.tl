<div class="card">
    <h2>{name}</h2>
    {?description}
    <p class="description-text">
    	{@gte key=description value=0}
		   +
		{/gte}
		<span class="description-value">{description}</span> points
    </p>
    <p class="cooldown-text">Cooldown: <span class="cooldown-value">{cooldown}</span> seconds</p>
    {/description}
    <div>
        <button>DISCARD</button>
    </div>
</div>