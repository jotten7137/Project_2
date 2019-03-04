queue()
    .defer(d3.json, '/api/reddit')
    .await(makeGraphs);

function makeGraphs(error, commentsJson) {
	
	//Clean comments data
	var project3Comments = commentsJson;
	var dateFormat = d3.time.format("%Y-%m-%d");
	project3Comments.forEach(function(d) {
    d["created_utc"] = dateFormat.parse(d["created_utc"]);
		d["created_utc"].setDate(1);
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(project3Comments);

	//Define Dimensions
	var dateDim = ndx.dimension(function(d) { return d["created_utc"]; });
	var authorDim = ndx.dimension(function(d) { return d["author.name"]; });
	var subredditDim = ndx.dimension(function(d) { return d["subreddit.display_name_prefixed"]; });
	var bodyDim = ndx.dimension(function(d) { return d["body"]; });
	var linkurlDim  = ndx.dimension(function(d) { return d["link_url"]; });
    var upsDim  = ndx.dimension(function(d) { return d["ups"]; });

	//Calculate metrics
	var all = ndx.groupAll();
	var numCommentsByDate = dateDim.group(); 
	var numCommentsByAuthor = authorDim.group();
	var numCommentsBySubreddit = subredditDim.group();
	var upsByAuthor = authorDim.group().reduceSum(function(d) {
		return d["ups"];
	});


	var most_popular_author = upsByAuthor.top(1)[0].value;

	//Define values (to be used in charts)
	var minDate = dateDim.bottom(1)[0]["created_utc"];
	var maxDate = dateDim.top(1)[0]["created_utc"];

    //Charts
	var timeChart = dc.barChart("#time-chart");
	var authorChart = dc.rowChart("#author-row-chart");
	var subredditChart = dc.rowChart("#subreddit-row-chart");
	var numberCommentsND = dc.numberDisplay("#number-comments-nd");
	var upsND = dc.numberDisplay("#total-ups-nd");

	numberCommentsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	upsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(ups)
		.formatNumber(d3.format(".3s"));

	timeChart
		.width(600)
		.height(160)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(dateDim)
		.group(numCommentsByDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.xAxisLabel("Year")
		.yAxis().ticks(4);

	authorChart
        .width(300)
        .height(250)
        .dimension(authorDim)
        .group(numCommentsByAuthor)
        .xAxis().ticks(4);

	subredditChart
		.width(300)
		.height(250)
        .dimension(subredditDim)
        .group(numCommentsBySubreddit)
        .xAxis().ticks(4);


    dc.renderAll();

};